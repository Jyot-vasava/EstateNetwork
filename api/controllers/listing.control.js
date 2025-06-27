// import Listing from "../models/listing.model.js";
// import { errorHandler } from "../utils/error.js";

// export const createlisting = async (req, res, next) => {
//   try {
//     // Validate required fields
//     const {
//       name,
//       description,
//       address,
//       regularprice,
//       discountedprice,
//       bathrooms,
//       bedrooms,
//       furnished,
//       parking,
//       type,
//       offer,
//       imageurl,
//       userRef,
//     } = req.body;

//     // Basic validation
//     if (
//       !name ||
//       !description ||
//       !address ||
//       !imageurl ||
//       imageurl.length === 0
//     ) {
//       return next(errorHandler(400, "Please provide all required fields"));
//     }

//     if (imageurl.length > 6) {
//       return next(
//         errorHandler(400, "You can only upload 6 images per listing")
//       );
//     }

//     if (offer && regularprice <= discountedprice) {
//       return next(
//         errorHandler(400, "Discount price must be lower than regular price")
//       );
//     }

//     const listing = await Listing.create({
//       name,
//       description,
//       address,
//       regularprice: Number(regularprice),
//       discountedprice: Number(discountedprice),
//       bathrooms: Number(bathrooms),
//       bedrooms: Number(bedrooms),
//       furnished: Boolean(furnished),
//       parking: Boolean(parking),
//       type,
//       offer: Boolean(offer),
//       imageurl,
//       userRef, // This should come from req.user.id via verifyToken middleware
//     });

//     return res.status(201).json({
//       success: true,
//       listing,
//       message: "Listing created successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

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
