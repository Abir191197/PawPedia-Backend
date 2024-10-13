"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloud = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../../config"));
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
});
// Function to send image to Cloudinary
const sendImageToCloud = (fileName, buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ public_id: fileName.trim(), resource_type: "auto" }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error("No result from Cloudinary upload"));
            }
            resolve(result);
        });
        uploadStream.end(buffer);
    });
};
exports.sendImageToCloud = sendImageToCloud;
// Multer memory storage configuration
const storage = multer_1.default.memoryStorage();
// File filter for Multer
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "video/mp4",
        "video/avi",
        "video/mkv",
        "video/mov",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type!"), false);
    }
};
// Export Multer upload middleware
exports.upload = (0, multer_1.default)({ storage, fileFilter });
