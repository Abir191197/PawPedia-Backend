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
exports.petPostControllers = void 0;
// post.controller.ts
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const post_service_1 = require("./post.service");
const getAllPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_service_1.PetPostService.getAllPosts();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pet posts retrieved successfully",
        data: posts,
    });
}));
const createPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        fileInformation: req.file,
        authUserInformation: req.user,
        typeInformation: req.body,
    };
    console.log("payload", payload);
    const result = yield post_service_1.PetPostService.createPost(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "File uploaded successfully",
        data: result,
    });
}));
const getPostByUserId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const post = yield post_service_1.PetPostService.getPostByUserIdFromDB(userId);
    if (!post) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Pet post not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "user post retrieved successfully",
        data: post,
    });
}));
const updatePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPost = yield post_service_1.PetPostService.updatePost(req.params.id, req.body);
    if (!updatedPost) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Pet post not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pet post updated successfully",
        data: updatedPost,
    });
}));
const deletePost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedPost = yield post_service_1.PetPostService.deletePost(req.params.id);
    if (!deletedPost) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Pet post not found",
            data: null,
        });
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pet post deleted successfully",
        data: null,
    });
}));
const createComment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield post_service_1.PetPostService.createCommentIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Comment created successfully",
        data: comment,
    });
}));
const getCommentsByPostId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield post_service_1.PetPostService.getCommentsByPostId(req.params.postId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Comments retrieved successfully",
        data: comments,
    });
}));
const createUpvote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the postId from request parameters and the user from the token
    const { postId } = req.params;
    const user = req.user;
    // Call the service function to handle the upvote
    const post = yield post_service_1.PetPostService.createUpvoteIntoDB(postId, user);
    // Send response back to client
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Upvote registered successfully",
        data: post,
    });
}));
const DownVote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the postId from request parameters and the user from the token
    const { postId } = req.params; // Correctly extract postId
    const user = req.user;
    // Log the postId for debugging
    console.log(postId);
    // Call the service function to handle the downvote
    const post = yield post_service_1.PetPostService.DownVoteIntoDB(postId, user);
    // Send response back to client
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Downvote registered successfully",
        data: post,
    });
}));
const PaymentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const user = req.user;
    // Call the service function to handle the downvote
    const post = yield post_service_1.PetPostService.paymentService(postId, user);
    console.log(postId);
    // Send response back to client
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment  successfully",
        data: post,
    });
}));
const followingController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the postId from request parameters and the user from the token
    const { postId } = req.params;
    const user = req.user;
    // Call the service function to handle the upvote
    const post = yield post_service_1.PetPostService.createFollowingIntoDB(postId, user);
    // Send response back to client
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Following successfully",
        data: post,
    });
}));
exports.petPostControllers = {
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
