import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createlisting = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularprice,
      discountedprice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageurl,
    } = req.body;

    if (
      !name ||
      !description ||
      !address ||
      !imageurl ||
      imageurl.length === 0
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    if (imageurl.length > 6) {
      return next(
        errorHandler(400, "You can only upload 6 images per listing")
      );
    }

    if (offer && regularprice <= discountedprice) {
      return next(
        errorHandler(400, "Discount price must be lower than regular price")
      );
    }

    const listing = await Listing.create({
      name,
      description,
      address,
      regularprice: Number(regularprice),
      discountedprice: Number(discountedprice),
      bathrooms: Number(bathrooms),
      bedrooms: Number(bedrooms),
      furnished: Boolean(furnished),
      parking: Boolean(parking),
      type,
      offer: Boolean(offer),
      imageurl,
      userRef: req.user.id,
    });

    return res.status(201).json({
      success: true,
      listing,
      message: "Listing created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get user listings
export const getUserListings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if the user is requesting their own listings
    if (req.user.id !== userId) {
      return next(errorHandler(401, "You can only view your own listings"));
    }

    const listings = await Listing.find({ userRef: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

// Get single listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Return the listing directly (no wrapper object)
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};


export const updateListing = async (req, res, next) => {
  try {
    console.log("Update request received for ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.user.id);

    // First, find the listing to check ownership
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    console.log("Listing userRef:", listing.userRef.toString());

    // Check if user owns the listing - Fixed: Convert both to strings
    if (req.user.id.toString() !== listing.userRef.toString()) {
      return res.status(401).json({
        success: false,
        message: "You can only update your own listings",
      });
    }

    // Validate the update data
    const {
      name,
      description,
      address,
      regularprice,
      discountedprice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageurl,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !description ||
      !address ||
      !imageurl ||
      imageurl.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (imageurl.length > 6) {
      return res.status(400).json({
        success: false,
        message: "You can only upload 6 images per listing",
      });
    }

    if (offer && regularprice <= discountedprice) {
      return res.status(400).json({
        success: false,
        message: "Discount price must be lower than regular price",
      });
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        address,
        regularprice: Number(regularprice),
        discountedprice: Number(discountedprice),
        bathrooms: Number(bathrooms),
        bedrooms: Number(bedrooms),
        furnished: Boolean(furnished),
        parking: Boolean(parking),
        type,
        offer: Boolean(offer),
        imageurl,
      },
      { new: true, runValidators: true }
    );

    console.log("Listing updated successfully");

    res.status(200).json({
      success: true,
      listing: updatedListing,
      message: "Listing updated successfully",
    });
  } catch (error) {
    console.error("Update listing error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: " +
          Object.values(error.errors)
            .map((e) => e.message)
            .join(", "),
      });
    }

    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Check if user owns the listing
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
