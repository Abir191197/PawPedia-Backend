import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import multer from "multer";
import config from "../../config";


// Cloudinary configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// Function to send image to Cloudinary
export const sendImageToCloud = (
  fileName: string,
  buffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: fileName.trim(), resource_type: "auto" },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("No result from Cloudinary upload"));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// Multer memory storage configuration
const storage = multer.memoryStorage();

// File filter for Multer
const fileFilter = (req: any, file: any, cb: any) => {
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
  } else {
    cb(new Error("Invalid file type!"), false);
  }
};

// Export Multer upload middleware
export const upload = multer({ storage, fileFilter });
