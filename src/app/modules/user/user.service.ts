import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/appError";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import httpStatus from "http-status";



const findUserFromDB = async (payload: JwtPayload | null) => {
  try {
    if (payload !== null) {
      // Find the user by email and populate following and followers fields
      const result = await UserModel.findOne({ email: payload.email })
        .populate("following", "name email role profileImage") // Populate following with specified fields
        .populate("followers", "name email role profileImage") // Populate followers with specified fields
        .select("-password"); // Exclude password from the returned object

      return result; // Return the populated user object
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to Get User");
  }
};
const updatedUserIntoDB = async (
  payload: JwtPayload | null,
  updateData: Partial<TUser>,
) => {
  try {
    if (payload !== null) {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: payload.email },
        { $set: updateData },
        { new: true, runValidators: true },
      ).select("-password"); // Exclude the password field from the result

      if (!updatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      return updatedUser;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid payload");
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update user");
  }
};



export const UserService = {
  findUserFromDB,
  updatedUserIntoDB,
  
};
