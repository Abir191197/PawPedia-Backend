// post.controller.ts
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IPetPost } from "./post.interface";
import { PetPostService } from "./post.service";
import { JwtPayload } from "jsonwebtoken";

const getAllPosts = catchAsync(async (req, res) => {
  const posts = await PetPostService.getAllPosts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet posts retrieved successfully",
    data: posts,
  });
});

const createPost = catchAsync(async (req, res) => {
 const payload = {
   fileInformation: req.file,
   authUserInformation: req.user,
   typeInformation: req.body,
 };
console.log("payload", payload)
   const result = await PetPostService.createPost(payload as any);
   sendResponse(res, {
     statusCode: httpStatus.OK,
     success: true,
     message: "File uploaded successfully",
     data: result,
   });
});


const getPostByUserId = catchAsync(async (req, res) => {

  
  const userId = req.user?._id;

  const post = await PetPostService.getPostByUserIdFromDB(userId);
  if (!post) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Pet post not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "user post retrieved successfully",
    data: post,
  });

 
});

const updatePost = catchAsync(async (req, res) => {
  const updatedPost = await PetPostService.updatePost(req.params.id, req.body);
  if (!updatedPost) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Pet post not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet post updated successfully",
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const deletedPost = await PetPostService.deletePost(req.params.id);
  if (!deletedPost) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Pet post not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet post deleted successfully",
    data: null,
  });
});


const createComment = catchAsync(async (req, res) => {
  

  const comment = await PetPostService.createCommentIntoDB(req.body,req.user as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});


const getCommentsByPostId = catchAsync(async (req, res) => {
  const comments = await PetPostService.getCommentsByPostId(req.params.postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});


const createUpvote = catchAsync(async (req, res) => {
  // Fetch the postId from request parameters and the user from the token
  const { postId } = req.params;
  const user = req.user;

  // Call the service function to handle the upvote
  const post = await PetPostService.createUpvoteIntoDB(postId, user as any);

  // Send response back to client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upvote registered successfully",
    data: post,
  });
});


const DownVote = catchAsync(async (req, res) => {
  // Fetch the postId from request parameters and the user from the token
  const { postId } = req.params; // Correctly extract postId
  const user = req.user;

  // Log the postId for debugging
  console.log(postId);

  // Call the service function to handle the downvote
  const post = await PetPostService.DownVoteIntoDB(postId, user as any);

  // Send response back to client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Downvote registered successfully",
    data: post,
  });
});

const PaymentController = catchAsync(async (req, res) => {
 
  const { postId } = req.params; 
  const user = req.user;
  

  

  // Call the service function to handle the downvote
  const post = await PetPostService.paymentService(postId, user as any);
console.log(postId)
  // Send response back to client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment  successfully",
    data: post,
  });
});


const followingController = catchAsync(async (req, res) => {
  // Fetch the postId from request parameters and the user from the token
  const { postId } = req.params;
  const user = req.user;

  // Call the service function to handle the upvote
  const post = await PetPostService.createFollowingIntoDB(postId, user as any);

  // Send response back to client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Following successfully",
    data: post,
  });
});






export const petPostControllers = {
  getAllPosts,
  createPost,
  getPostByUserId,
  updatePost,
  deletePost,
  getCommentsByPostId,
  createComment,
  createUpvote,
  DownVote,
  PaymentController,
  followingController,
};
