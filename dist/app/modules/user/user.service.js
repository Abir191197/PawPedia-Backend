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
exports.UserService = void 0;
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = __importDefault(require("./user.model"));
const http_status_1 = __importDefault(require("http-status"));
const findUserFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (payload !== null) {
            // Find the user by email and populate following and followers fields
            const result = yield user_model_1.default.findOne({ email: payload.email })
                .populate("following", "name email role profileImage") // Populate following with specified fields
                .populate("followers", "name email role profileImage") // Populate followers with specified fields
                .select("-password"); // Exclude password from the returned object
            return result; // Return the populated user object
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to Get User");
    }
});
const updatedUserIntoDB = (payload, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield user_model_1.default.findOneAndUpdate({ email: payload.email }, { $set: updateData }, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        return updatedUser;
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            throw error;
        }
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user");
    }
});
const finAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users and populate following and followers fields
        const result = yield user_model_1.default.find().populate("following", "name email role profileImage");
        return result; // Return the populated user object
    }
    catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to get users from database.");
    }
});
const userDeleteFromDB = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by email and populate following and followers fields
        // @ts-ignore
        const result = yield user_model_1.default.findByIdAndDelete({ _id: params === null || params === void 0 ? void 0 : params.userId });
        console.log(result);
        return result; // Return the populated user object
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to Delete");
    }
});
exports.UserService = {
    findUserFromDB,
    updatedUserIntoDB,
    finAllUserFromDB,
    userDeleteFromDB,
};
