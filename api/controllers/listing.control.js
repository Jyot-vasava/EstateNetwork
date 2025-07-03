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
      userRef: req.user.id, // ✅ Pull from verified token
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

    res.status(200).json(listings);
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

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// FIXED: Complete rewrite of updateListing controller
export const updateListing = async (req, res, next) => {
  try {
    // First, find the listing to check ownership
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Check if user owns the listing
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listings"));
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

    res.status(200).json({
      success: true,
      listing: updatedListing,
      message: "Listing updated successfully",
    });
  } catch (error) {
    next(error);
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