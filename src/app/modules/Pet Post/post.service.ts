// post.service.ts
import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { IPetPost, PetPost } from "./post.interface";
import { PetPostModel } from "./post.model";
import { sendImageToCloud } from "../../utils/sendImageToCloud";
import { Jwt, JwtPayload } from "jsonwebtoken";
import { Document, Types } from "mongoose";
import { sendPaymentRequest } from "../Payment/payment.utils";
import UserModel from "../user/user.model";
import { TUser } from "../user/user.interface";

const createPost = async (payload: {
  authUserInformation: any;
  fileInformation?: any; // Made fileInformation optional
  typeInformation: any;
}) => {
  const { authUserInformation, fileInformation, typeInformation } = payload;

  // Ensure all required data is present
  if (!authUserInformation || !authUserInformation._id) {
    throw new AppError(httpStatus.BAD_REQUEST, "User information is required");
  }

  if (!typeInformation || !typeInformation.formData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Type information is required");
  }

  let formDataArray;
  try {
    // Parse the formData string into a JavaScript array
    formDataArray = JSON.parse(typeInformation.formData);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid form data format");
  }

  // Ensure formData is an array and contains at least one item
  if (!Array.isArray(formDataArray) || formDataArray.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Form data must be a non-empty array"
    );
  }

  // Extract the first item from the formData array
  const { title, content, category, isPremium, PremiumAmount } =
    formDataArray[0];

  // Validate the title, content, and category
  if (!title || !content || !category) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Title, content, and category are required"
    );
  }

  // Prepare file upload logic only if fileInformation is provided
  let secure_url = null;
  if (
    fileInformation &&
    fileInformation.buffer &&
    fileInformation.originalname
  ) {
    const fileName = fileInformation.originalname;
    const buffer = fileInformation.buffer;

    try {
      // Upload image to the cloud and get the secure_url
      const uploadResponse = await sendImageToCloud(fileName, buffer);
      secure_url = uploadResponse.secure_url; // Store secure_url from the cloud response
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, "Image upload failed");
    }
  }

  try {
    // Create post data object
    const postData = {
      authorId: authUserInformation._id, // The author's user ID
      title: title, // Title from formData
      content: content, // Content from formData
      category: category, // Category from formData
      isPremium: isPremium || false, // Default to false if not provided
      PremiumAmount: isPremium ? PremiumAmount || 0 : null, // Only set if isPremium is true
      PaidByUserPostId: isPremium ? [authUserInformation._id] : [], // Author can access their own premium post
      images: secure_url ? [secure_url] : [], // Only include image if available
      upvote: [], // Empty array for upvotes
      downvote: [],
      // Empty array for downvotes
    };

    // Create a new post instance and save it
    const newPost = new PetPostModel(postData);
    return await newPost.save();
  } catch (error) {
    console.error("Error creating post:", error);
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create the post");
  }
};



const getAllPosts = async () => {
  try {
    return await PetPostModel.find()
      .populate("authorId", "-password") // Populate the post's authorId
      .populate({
        path: "comments.authorId", // Populate the authorId inside each comment
        select: "-password", // Exclude password field from populated user data
      })
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve posts"
    );
  }
};



const getPostByUserIdFromDB = async (
  userId: string
): Promise<IPetPost[] | null> => {
  
  try {
    const posts = await PetPostModel.find({ authorId: userId });
    if (posts.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "No posts found for this user");
    }
    
    return posts;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve posts"
    );
  }
};

const updatePost = async (
  postId: string,
  updateData: Partial<IPetPost>
): Promise<IPetPost | null> => {
  try {
    const updatedPost = await PetPostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    ).populate("authorId", "-password");
    if (!updatedPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return updatedPost;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update post");
  }
};

const deletePost = async (postId: string): Promise<IPetPost | null> => {
  try {
    const deletedPost = await PetPostModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return deletedPost;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete post"
    );
  }
};


const createCommentIntoDB = async (
  {
    commentData: { postId, content },
  }: { commentData: { postId: string; content: string } },
  user: { _id: string ,name:string}
) => {
   // Now you can use postId and content directly
  const authorId = user._id; // Extract the author's ID from the user object
  const authorName = user.name;

console.log(authorId, authorName);
console.log(postId, content);



  try {
    const post = await PetPostModel.findById(postId); // Using destructured postId
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }

    // Create a new comment object with authorId and content
    const newComment = {
      authorId,
      authorName,// Add the author's ID
      content, // The comment content
      createdAt: new Date(), // Timestamp of the comment creation
    };

    // Push the new comment into the comments array
    post.comments.push(newComment as any);

    // Save the updated post
    return await post.save();
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST,"Error from here");
  }
};



const getCommentsByPostId = async (postId: string) => {
  try {
    const post = await PetPostModel.findById(postId).populate(
      "comments.authorId",
      "-password"
    );
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return post.comments;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve comments"
    );
  }
};


 const createUpvoteIntoDB = async (postId: string, user: JwtPayload) => {
  const userId =  user._id;

  // Find the post by its ID
  const post = await PetPostModel.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Ensure post is treated as PetPost type
  const petPost = post as unknown as Document<unknown, {}, IPetPost> & PetPost;

  // Check if the user has already upvoted the post
  const hasUpvoted = petPost.upvote.some((id: { equals: (arg0: Types.ObjectId) => any; }) => id.equals(userId));

  if (hasUpvoted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already upvoted this post"
    );
  }

  // Add the user's ID to the upvote array
  petPost.upvote.push(userId);

  // Save the updated post
  await petPost.save();

  // Return the updated post data
  return {
    message: "Upvote added successfully",
    postId: petPost._id,
    upvotes: petPost.upvote.length,
  };
};


export const DownVoteIntoDB = async (postId: string, user: JwtPayload) => {
  const userId = user._id;

  // Find the post by its ID
  const post = await PetPostModel.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Ensure post is treated as PetPost type
  const petPost = post as unknown as Document<unknown, {}, IPetPost> & PetPost;

  // Check if the user has already downvoted the post
  const hasDownvoted = petPost.downvote.some(
    (id: { equals: (arg0: Types.ObjectId) => any }) => id.equals(userId)
  );

  if (hasDownvoted) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You have already downvoted this post"
    );
  }

  // Add the user's ID to the downvote array
  petPost.downvote.push(userId); // Ensure that your model has a downvote array

  // Save the updated post
  await petPost.save();

  // Return the updated post data
  return {
    message: "Downvote added successfully",
    postId: petPost._id,
    downvotes: petPost.downvote.length, // Return the downvotes count
  };
};


export const paymentService = async (postId: string, user: JwtPayload) => {
  const { _id: userId, email, address, phone } = user;

  // Find the post by its ID
  const post = await PetPostModel.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Generate a unique booking ID
  const bookingId = `BOOK-${userId}-${postId}-${Date.now()}`;

  // Prepare user data for payment request, including the booking ID
  const userData = {
    userId,
    name: user.name || "Anonymous", // Ensure name is present, otherwise fallback
    email,
    address,
    phone,
    postId,
    bookingId,
  };

  // Send the payment request
  try {
    const paymentResponse = await sendPaymentRequest(userData);
    console.log("Payment Response:", paymentResponse);
    return paymentResponse; // Return the response from the payment request
  } catch (error) {
    console.error("Payment request error:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Payment request failed"
    );
  }
};



const createFollowingIntoDB = async (postId: string, user :JwtPayload) => {
  const userId = user._id;

  // Find the post and its author in one query
  const petPost = await PetPostModel.findById(postId);
  if (!petPost) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // @ts-ignore
  const authorId = petPost.authorId;

  // Prevent users from following themselves
  if (userId === authorId.toString()) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot follow yourself");
  }

  // Use findOneAndUpdate to check if already following and update in one operation
  const updatedCurrentUser = await UserModel.findOneAndUpdate(
    { _id: userId, following: { $ne: authorId } },
    { $addToSet: { following: authorId } },
    { new: true }
  );

  if (!updatedCurrentUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are already following this user or user not found"
    );
  }

  // Update the author's followers in one operation
  const updatedAuthor = await UserModel.findOneAndUpdate(
    { _id: authorId, followers: { $ne: userId } },
    { $addToSet: { followers: userId } },
    { new: true }
  );

  return {
    message: "Successfully followed the user",
  };
};





export const PetPostService = {
  createPost,
  getAllPosts,
  getPostByUserIdFromDB,
  updatePost,
  deletePost,
  createCommentIntoDB,
  getCommentsByPostId,
  //updateComment,
  //deleteComment,
  createUpvoteIntoDB,
  DownVoteIntoDB,
  paymentService,
  createFollowingIntoDB,
};
