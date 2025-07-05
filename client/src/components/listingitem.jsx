import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaBed, FaBath, FaParking, FaCouch } from "react-icons/fa";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listings/${listing._id}`}>
        <img
          src={
            listing.imageurl?.[0] ||
            "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={listing.name}
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="p-3 flex flex-col gap-2 w-full">
        <Link to={`/listings/${listing._id}`}>
          <p className="truncate text-lg font-semibold text-slate-700 hover:text-slate-900 transition-colors">
            {listing.name}
          </p>
        </Link>

        <div className="flex items-center gap-1">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="text-sm text-gray-600 truncate w-full">
            {listing.address}
          </p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {listing.description}
        </p>

        <p className="text-slate-500 mt-2 font-semibold text-lg">
          $
          {listing.offer
            ? listing.discountedprice?.toLocaleString("en-US")
            : listing.regularprice?.toLocaleString("en-US")}
          {listing.type === "rent" && " / month"}
        </p>

        {listing.offer && (
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              ${listing.regularprice?.toLocaleString("en-US")}
            </span>
            <span className="text-green-600 text-xs font-medium">
              Save $
              {(listing.regularprice - listing.discountedprice)?.toLocaleString(
                "en-US"
              )}
            </span>
          </div>
        )}

        <div className="text-slate-700 flex gap-4">
          <div className="flex items-center gap-1">
            <FaBed className="h-4 w-4" />
            <span className="font-bold text-xs">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <FaBath className="h-4 w-4" />
            <span className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {listing.parking && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
              <FaParking className="h-3 w-3" />
              <span>Parking</span>
            </div>
          )}

          {listing.furnished && (
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              <FaCouch className="h-3 w-3" />
              <span>Furnished</span>
            </div>
          )}

          <div
            className={`px-2 py-1 rounded text-xs font-medium ${
              listing.type === "rent"
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
