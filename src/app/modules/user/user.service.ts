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
   payload: JwtPayload,
   updateData: Partial<TUser>
 ) => {
   try {
     const updatedUser = await UserModel.findOneAndUpdate(
       { email: payload.email },
       { $set: updateData },
       { new: true, runValidators: true }
     ).select("-password");

     if (!updatedUser) {
       throw new AppError(httpStatus.NOT_FOUND, "User not found");
     }

     return updatedUser;
   } catch (error: any) {
     if (error instanceof AppError) {
       throw error;
     }
     throw new AppError(httpStatus.BAD_REQUEST, "Failed to update user");
   }
 };


const finAllUserFromDB = async () => {
  try {
    // Find users and populate following and followers fields
    const result = await UserModel.find().populate(
      "following",
      "name email role profileImage"
    );
   
    return result; // Return the populated user object
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error for debugging
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to get users from database."
    );
  }
};


const userDeleteFromDB = async (params: unknown) => {
 
  try {
    // Find the user by email and populate following and followers fields
    // @ts-ignore
    const result = await UserModel.findByIdAndDelete({ _id: params?.userId });

    console.log(result);
    return result; // Return the populated user object
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to Delete");
  }
};

export const UserService = {
  findUserFromDB,
  updatedUserIntoDB,
  finAllUserFromDB,
  userDeleteFromDB,
};
