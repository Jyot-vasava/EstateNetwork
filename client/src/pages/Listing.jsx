import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import Contact from "../components/contact";


const Listing = () => {
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState(null);
    const [error, setError] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [contact, setContact] = useState(false);

    const params = useParams();
    console.log(listing);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listings/get/${params.listingId}`);
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

    return (
      <main>
        {loading && <p className="text-center my-7 text-xl">Loading...</p>}
        {error && (
          <p className="text-center my-7 text-2xl text-red-500">
            Failed to fetch listing
          </p>
        )}
        {listing && !loading && !error && (
          <div className="m-5">
            {/* Image Carousel */}
            <Swiper
              modules={[Navigation]}
              navigation={true}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              className="mySwiper h-96"
            >
              {listing.imageurl &&
                listing.imageurl.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`${listing.name} ${index + 1}`}
                      className="w-full  h-96  object-cover"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>

            {/* Listing Details */}
            <div className="max-w-4xl mx-auto p-6">
              <div className="flex flex-col gap-6">
                {/* Title and Basic Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {listing.name}
                  </h1>
                  <p className="text-gray-600 mt-2">{listing.address}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="bg-red-900 text-white px-3 py-1 rounded-md text-sm">
                      {listing.type === "rent" ? "For Rent" : "For Sale"}
                    </span>
                    {listing.offer && (
                      <span className="bg-green-900 text-white px-3 py-1 rounded-md text-sm">
                        Special Offer
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div>
                  {listing.offer ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          🏷️ SPECIAL OFFER
                        </span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Save $
                          {(
                            listing.regularprice - listing.discountedprice
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-green-600">
                          ${listing.discountedprice.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          ${listing.regularprice.toLocaleString()}
                        </span>
                        {listing.type === "rent" && (
                          <span className="text-base font-normal text-gray-600">
                            / month
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-green-600">
                        ${listing.regularprice.toLocaleString()}
                      </span>
                      {listing.type === "rent" && (
                        <span className="text-base font-normal text-gray-600">
                          / month
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Property Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {listing.bedrooms > 1
                        ? listing.bedrooms + " Bedrooms"
                        : listing.bedrooms + " Bedroom"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {listing.bathrooms > 1
                        ? listing.bathrooms + " Bathrooms"
                        : listing.bathrooms + " Bathroom"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {listing.parking ? "Parking" : " No Parking"}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {listing.furnished ? "Furnished" : "Unfurnished"}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              </div>

              {console.log("user:", user)}
              {console.log("listing.userRef:", listing.userRef)}

              {user && listing.userRef !== user._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="mt-6 bg-blue-500 text-white p-3 uppercase rounded-lg hover:bg-blue-700"
                >
                  Contact Landlord
                </button>
              )}

              {contact && <Contact listing={listing} />}
            </div>
          </div>
        )}
      </main>
    );
};

export default Listing;
