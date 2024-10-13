"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetPostRoutes = void 0;
const auth_1 = __importDefault(require("../../middlewares/auth")); // Authentication middleware
const user_constant_1 = require("../user/user.constant");
const post_controller_1 = require("./post.controller");
const sendImageToCloud_1 = require("../../utils/sendImageToCloud");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Routes for Pet Posts
router.get("/posts", post_controller_1.petPostControllers.getAllPosts // Get all pet posts
);
router.post("/posts", 
// Authentication middleware (adjust roles as needed)
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), 
// File upload middleware (assuming you use multer for file uploads)
sendImageToCloud_1.upload.single("file"), 
// Middleware to parse JSON from form data if necessary
(req, res, next) => {
    if (req.body.data) {
        try {
            req.body = JSON.parse(req.body.data);
        }
        catch (error) {
            return next(error);
        }
    }
    next();
}, post_controller_1.petPostControllers.createPost);
router.get("/posts/:UserId", post_controller_1.petPostControllers.getPostByUserId // Get a specific pet post by ID
);
router.put("/posts/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.updatePost // Update an existing pet post
);
router.delete("/posts/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.deletePost // Delete a pet post
);
// Routes for Comments
router.get("/posts/:postId/comments", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.getCommentsByPostId // Get comments for a specific post
);
router.post("/posts/comments", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.createComment // Create a new comment on a post
);
router.post("/posts/upvote/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.createUpvote);
router.post("/posts/downvote/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.DownVote);
router.post("/posts/payment/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.PaymentController);
router.post("/posts/following/:postId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), post_controller_1.petPostControllers.followingController);
// router.put(
//   "/comments/:id",
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   petPostControllers.updateComment // Update a specific comment
// );
// router.delete(
//   "/comments/:id",
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   petPostControllers.deleteComment // Delete a specific comment
// );
// Exporting the routes
exports.PetPostRoutes = router;
