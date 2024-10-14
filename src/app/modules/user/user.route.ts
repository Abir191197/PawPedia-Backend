import express, { NextFunction, Request, Response } from "express";

import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();


router.get(
  "/me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userControllers.findUser,
);
router.put(
  "/me/update",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userControllers.updatedUser
);

router.get(
  "/allUsers",
  auth(USER_ROLE.admin, USER_ROLE.user), // Assuming this checks for admin and user roles
  userControllers.AllUsersController
);


router.delete(
  "/allUsers/:userId",
  auth(USER_ROLE.admin),
  userControllers.UserDeleteController
);



export const UserRoutes = router;
