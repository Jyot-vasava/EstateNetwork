import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createlisting,
  getUserListings,
  deleteListing,
  updateListing,
  getListing,
} from "../controllers/listing.control.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Image upload endpoint
router.post(
  "/upload-images",
  verifyToken,
  upload.array("images", 6),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No files uploaded",
        });
      }

      if (req.files.length > 6) {
        return res.status(400).json({
          success: false,
          error: "You can only upload maximum 6 images",
        });
      }

      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "listings",
              transformation: [
                { width: 800, height: 600, crop: "limit" },
                { quality: "auto" },
                { format: "webp" },
              ],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        urls: imageUrls,
        message: "Images uploaded successfully",
      });
    } catch (error) {
      console.error("Image upload error:", error);
      next(error);
    }
  }
);

// Create listing endpoint
router.post("/create", verifyToken, createlisting);

// Get user listings
router.get("/user/:userId", verifyToken, getUserListings);

// Update listing - FIXED: Changed from POST to PUT to match frontend
router.put("/update/:id", verifyToken, updateListing);

// Delete listing
router.delete("/delete/:id", verifyToken, deleteListing);

// Get single listing (put this after specific routes)
router.get("/get/:id", getListing);

export default router;