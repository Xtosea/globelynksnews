import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Example: Upload an image
export async function uploadImage(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blog-images", // optional folder
    });
    return result.secure_url; // URL of uploaded image
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
}