import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import Contact from "../components/contact";
import config from "../../config";

const Listing = () => {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  const navigate = useNavigate();

  const params = useParams();
  console.log(listing);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${config.BACKEND_API}/api/listings/get/${params.listingId}`
        );
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-white">Loading property details...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-500/20 border border-red-500/50 text-red-200 p-8 rounded-2xl">
            <p className="text-2xl font-semibold">Failed to fetch listing</p>
            <p className="text-lg mt-2">Please try again later</p>
          </div>
        </div>
      )}
      {listing && !loading && !error && (
        <div className="relative">
          {/* Back to Profile Button */}
          <div className="absolute top-6 left-6 z-20">
            <button
              onClick={handleBackToProfile}
              className="bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-3 shadow-lg transform hover:scale-105"
            >
              <span className="text-xl">←</span>
              <span className="font-semibold">Back to Profile</span>
            </button>
          </div>

          {/* Image Carousel */}
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              navigation={true}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              className="mySwiper h-96 lg:h-[500px]"
            >
              {listing.imageurl &&
                listing.imageurl.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <img
                        src={url}
                        alt={`${listing.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>

          {/* Listing Details */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col gap-8">
                {/* Title and Basic Info */}
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {listing.name}
                  </h1>
                  <p className="text-xl text-gray-300 mb-6">
                    {listing.address}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {listing.type === "rent" ? "For Rent" : "For Sale"}
                    </span>
                    {listing.offer && (
                      <span className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        🔥 Special Offer
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  {listing.offer ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          🏷️ SPECIAL OFFER
                        </span>
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          Save INR  {(
                            listing.regularprice - listing.discountedprice
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-4xl lg:text-5xl font-bold text-green-400">
                         INR {listing.discountedprice.toLocaleString()}
                        </span>
                        <span className="text-2xl text-gray-400 line-through">
                         INR {listing.regularprice.toLocaleString()}
                        </span>
                        {listing.type === "rent" && (
                          <span className="text-lg font-normal text-gray-300">
                            / month
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-4xl lg:text-5xl font-bold text-green-400">
                        INR {listing.regularprice.toLocaleString()}
                      </span>
                      {listing.type === "rent" && (
                        <span className="text-lg font-normal text-gray-300">
                          / month
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg">
                    <div className="text-xl font-bold text-white">
                      {listing.bedrooms > 1
                        ? listing.bedrooms + " Bedrooms"
                        : listing.bedrooms + " Bedroom"}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg">
                    <div className="text-xl font-bold text-white">
                      {listing.bathrooms > 1
                        ? listing.bathrooms + " Bathrooms"
                        : listing.bathrooms + " Bathroom"}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg">
                    <div className="text-xl font-bold text-white">
                      {listing.parking ? "Parking ✓" : "No Parking ✗"}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg">
                    <div className="text-xl font-bold text-white">
                      {listing.furnished ? "Furnished ✓" : "Unfurnished ✗"}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Property Description
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {listing.description}
                  </p>
                </div>
              </div>

              {console.log("user:", user)}
              {console.log("listing.userRef:", listing.userRef)}

              {user && listing.userRef !== user._id && !contact && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setContact(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                  >
                    Contact Landlord
                  </button>
                </div>
              )}

              {contact && (
                <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                  <Contact listing={listing} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;