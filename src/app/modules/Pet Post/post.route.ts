
import auth from "../../middlewares/auth"; // Authentication middleware
import { USER_ROLE } from "../user/user.constant";
import { petPostControllers } from "./post.controller";
import { upload } from "../../utils/sendImageToCloud";
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();

// Routes for Pet Posts
router.get(
  "/posts",

  petPostControllers.getAllPosts // Get all pet posts
);


router.post(
  "/posts",

  // Authentication middleware (adjust roles as needed)
  auth(USER_ROLE.admin, USER_ROLE.user),

  // File upload middleware (assuming you use multer for file uploads)
  upload.single("file"),

  // Middleware to parse JSON from form data if necessary
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (error) {
        return next(error);
      }
    }
    next();
  },
  petPostControllers.createPost
);




router.get(
  "/posts/MyContents",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.getPostByUserId // Get a specific pet post by ID
);

router.put(
  "/posts/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.updatePost // Update an existing pet post
);

router.delete(
  "/posts/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.deletePost // Delete a pet post
);

// Routes for Comments
router.get(
  "/posts/:postId/comments",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.getCommentsByPostId // Get comments for a specific post
);

router.post(
  "/posts/comments",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.createComment // Create a new comment on a post
);

router.post(
  "/posts/upvote/:postId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.createUpvote
);

router.post(
  "/posts/downvote/:postId", 
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.DownVote
);

router.post(
  "/posts/payment/:postId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.PaymentController
);


router.post(
  "/posts/following/:postId",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.followingController
);







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
export const PetPostRoutes = router;
