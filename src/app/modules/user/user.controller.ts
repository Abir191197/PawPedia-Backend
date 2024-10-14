import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";



// Controller to handle retrieving a user profile
const findUser = catchAsync(async (req, res) => {
  if (!req.user) {
    // Handle case where req.user is undefined
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  try {
    const result = await UserService.findUserFromDB(req.user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to retrieve user profile",
      data: null,
    });
  }
});

// Controller to handle updating a user profile

const updatedUser = catchAsync(async (req, res) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const { userdata } = req.body; 
  console.log("userdata", userdata);

  try {
    const result = await UserService.updatedUserIntoDB(req.user, userdata);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: error.message || "Failed to update profile",
      data: null,
    });
  }
});


const AllUsersController = catchAsync(async (req, res) => {
  
  try {
    const result = await UserService.finAllUserFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profiles retrieved successfully",
      data: result,
    });
  } catch (error) {
    
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message:  "Failed to retrieve user profiles",
      data: null,
    });
  }
});


const UserDeleteController = catchAsync(async (req, res) => {
 
console.log(req.params);
  try {
    const result = await UserService.userDeleteFromDB(req.params);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Delete successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to Delete user profile",
      data: null,
    });
  }
});



  
export const userControllers = {
  findUser,
  updatedUser,
  AllUsersController,
  UserDeleteController,
};
