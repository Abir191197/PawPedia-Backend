"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetPostService = exports.paymentService = exports.DownVoteIntoDB = void 0;
// post.service.ts
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const post_model_1 = require("./post.model");
const sendImageToCloud_1 = require("../../utils/sendImageToCloud");
const payment_utils_1 = require("../Payment/payment.utils");
const user_model_1 = __importDefault(require("../user/user.model"));
const createPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { authUserInformation, fileInformation, typeInformation } = payload;
    // Ensure all required data is present
    if (!authUserInformation || !authUserInformation._id) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User information is required");
    }
    if (!typeInformation || !typeInformation.formData) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Type information is required");
    }
    let formDataArray;
    try {
        // Parse the formData string into a JavaScript array
        formDataArray = JSON.parse(typeInformation.formData);
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid form data format");
    }
    // Ensure formData is an array and contains at least one item
    if (!Array.isArray(formDataArray) || formDataArray.length === 0) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Form data must be a non-empty array");
    }
    // Extract the first item from the formData array
    const { title, content, category, isPremium, PremiumAmount } = formDataArray[0];
    // Validate the title, content, and category
    if (!title || !content || !category) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Title, content, and category are required");
    }
    // Prepare file upload logic only if fileInformation is provided
    let secure_url = null;
    if (fileInformation &&
        fileInformation.buffer &&
        fileInformation.originalname) {
        const fileName = fileInformation.originalname;
        const buffer = fileInformation.buffer;
        try {
            // Upload image to the cloud and get the secure_url
            const uploadResponse = yield (0, sendImageToCloud_1.sendImageToCloud)(fileName, buffer);
            secure_url = uploadResponse.secure_url; // Store secure_url from the cloud response
        }
        catch (error) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Image upload failed");
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
        const newPost = new post_model_1.PetPostModel(postData);
        return yield newPost.save();
    }
    catch (error) {
        console.error("Error creating post:", error);
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create the post");
    }
});
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield post_model_1.PetPostModel.find()
            .populate("authorId", "-password") // Populate the post's authorId
            .populate({
            path: "comments.authorId", // Populate the authorId inside each comment
            select: "-password", // Exclude password field from populated user data
        })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve posts");
    }
});
const getPostByUserIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.PetPostModel.find({ authorId: userId });
        if (posts.length === 0) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "No posts found for this user");
        }
        return posts;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve posts");
    }
});
const updatePost = (postId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield post_model_1.PetPostModel.findByIdAndUpdate(postId, updateData, { new: true, runValidators: true }).populate("authorId", "-password");
        if (!updatedPost) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return updatedPost;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update post");
    }
});
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPost = yield post_model_1.PetPostModel.findByIdAndDelete(postId);
        if (!deletedPost) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return deletedPost;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete post");
    }
});
const createCommentIntoDB = (_a, user_1) => __awaiter(void 0, [_a, user_1], void 0, function* ({ commentData: { postId, content }, }, user) {
    // Now you can use postId and content directly
    const authorId = user._id; // Extract the author's ID from the user object
    const authorName = user.name;
    console.log(authorId, authorName);
    console.log(postId, content);
    try {
        const post = yield post_model_1.PetPostModel.findById(postId); // Using destructured postId
        if (!post) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        // Create a new comment object with authorId and content
        const newComment = {
            authorId,
            authorName, // Add the author's ID
            content, // The comment content
            createdAt: new Date(), // Timestamp of the comment creation
        };
        // Push the new comment into the comments array
        post.comments.push(newComment);
        // Save the updated post
        return yield post.save();
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Error from here");
    }
});
const getCommentsByPostId = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.PetPostModel.findById(postId).populate("comments.authorId", "-password");
        if (!post) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return post.comments;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve comments");
    }
});
const createUpvoteIntoDB = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = user._id;
    // Find the post by its ID
    const post = yield post_model_1.PetPostModel.findById(postId);
    if (!post) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    // Ensure post is treated as PetPost type
    const petPost = post;
    // Check if the user has already upvoted the post
    const hasUpvoted = petPost.upvote.some((id) => id.equals(userId));
    if (hasUpvoted) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You have already upvoted this post");
    }
    // Add the user's ID to the upvote array
    petPost.upvote.push(userId);
    // Save the updated post
    yield petPost.save();
    // Return the updated post data
    return {
        message: "Upvote added successfully",
        postId: petPost._id,
        upvotes: petPost.upvote.length,
    };
});
const DownVoteIntoDB = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = user._id;
    // Find the post by its ID
    const post = yield post_model_1.PetPostModel.findById(postId);
    if (!post) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    // Ensure post is treated as PetPost type
    const petPost = post;
    // Check if the user has already downvoted the post
    const hasDownvoted = petPost.downvote.some((id) => id.equals(userId));
    if (hasDownvoted) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You have already downvoted this post");
    }
    // Add the user's ID to the downvote array
    petPost.downvote.push(userId); // Ensure that your model has a downvote array
    // Save the updated post
    yield petPost.save();
    // Return the updated post data
    return {
        message: "Downvote added successfully",
        postId: petPost._id,
        downvotes: petPost.downvote.length, // Return the downvotes count
    };
});
exports.DownVoteIntoDB = DownVoteIntoDB;
const paymentService = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId, email, address, phone } = user;
    // Find the post by its ID
    const post = yield post_model_1.PetPostModel.findById(postId);
    if (!post) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
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
        const paymentResponse = yield (0, payment_utils_1.sendPaymentRequest)(userData);
        console.log("Payment Response:", paymentResponse);
        return paymentResponse; // Return the response from the payment request
    }
    catch (error) {
        console.error("Payment request error:", error);
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Payment request failed");
    }
});
exports.paymentService = paymentService;
const createFollowingIntoDB = (postId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = user._id;
    // Find the post and its author in one query
    const petPost = yield post_model_1.PetPostModel.findById(postId);
    if (!petPost) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
    }
    // @ts-ignore
    const authorId = petPost.authorId;
    // Prevent users from following themselves
    if (userId === authorId.toString()) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You cannot follow yourself");
    }
    // Use findOneAndUpdate to check if already following and update in one operation
    const updatedCurrentUser = yield user_model_1.default.findOneAndUpdate({ _id: userId, following: { $ne: authorId } }, { $addToSet: { following: authorId } }, { new: true });
    if (!updatedCurrentUser) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You are already following this user or user not found");
    }
    // Update the author's followers in one operation
    const updatedAuthor = yield user_model_1.default.findOneAndUpdate({ _id: authorId, followers: { $ne: userId } }, { $addToSet: { followers: userId } }, { new: true });
    return {
        message: "Successfully followed the user",
    };
});
exports.PetPostService = {
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
    DownVoteIntoDB: exports.DownVoteIntoDB,
    paymentService: exports.paymentService,
    createFollowingIntoDB,
};
