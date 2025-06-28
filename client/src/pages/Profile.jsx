import { useSelector, useDispatch } from "react-redux";
import { useState, useRef } from "react";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    profilePicture: user?.profilePicture || "",
  });

  console.log(formData);
  const [profileImage, setProfileImage] = useState(user?.profilePicture);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mylistingserror, setMylistingserror] = useState(false);
  const [userslistings, setUserslistings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"
    );
    formDataImg.append("folder", "profile_images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formDataImg,
        }
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      let updatedFormData = { ...formData };

      if (imageFile) {
        try {
          setUploadingImage(true);
          const imageUrl = await uploadImageToCloudinary(imageFile);
          updatedFormData.profilePicture = imageUrl;
          setMessage("Image uploaded successfully!");
        } catch (error) {
          setUploadingImage(false);
          dispatch(
            updateUserFailure("Failed to upload image: " + error.message)
          );
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      if (!updatedFormData.password) {
        delete updatedFormData.password;
      }

      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFormData),
      });

      const data = await res.json();

      if (data.success === false || !res.ok) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        return;
      }

      dispatch(updateUserSuccess(data));
      setMessage("Profile updated successfully!");
      setImageFile(null);

      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: "",
        profilePicture: data.profilePicture || "",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      dispatch(deleteUserStart());
      try {
        const response = await fetch(`/api/user/delete/${user._id}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();
        if (data.success) {
          dispatch(deleteUserSuccess());
          setMessage("Account deleted successfully");
        } else {
          dispatch(deleteUserFailure(data.message));
          setMessage(data.message || "Failed to delete account");
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
        setMessage("An error occurred while deleting account");
      }
    }
  };

  const handleMyListings = async () => {
    try {
      setLoadingListings(true);
      setMylistingserror(false);
      setMessage("");

      console.log("Fetching listings for user:", user._id);

      const response = await fetch(`/api/listing/user/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success === false) {
        setMylistingserror(true);
        setMessage(data.message || "Failed to fetch listings");
        return;
      }

      const listings = Array.isArray(data)
        ? data
        : data.listings || data.data || [];
      setUserslistings(listings);
      setShowListings(true);

      if (listings.length === 0) {
        setMessage("No listings found");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setMylistingserror(true);
      setMessage(`Error fetching listings: ${error.message}`);
    } finally {
      setLoadingListings(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success !== false) {
          setUserslistings(
            userslistings.filter((listing) => listing._id !== listingId)
          );
          setMessage("Listing deleted successfully!");
        } else {
          setMessage(data.message || "Failed to delete listing");
        }
      } catch (error) {
        setMessage("Error deleting listing");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(signOut());
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  // Helper function to format price
  const formatPrice = (listing) => {
    const price = listing.regularPrice || listing.discountedprice || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-200/30 to-blue-200/30 rounded-full blur-2xl"></div>

        {!showListings ? (
          // Profile Form
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 relative z-10"
          >
            <div className="flex flex-col items-center">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer group ring-4 ring-white"
                onClick={handleImageClick}
              >
                <img
                  src={profileImage || user?.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium">
                    Change Photo
                  </span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                {formData.username}
              </h1>
              <p className="text-gray-500 text-sm">{formData.email}</p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-center shadow-md ${
                  message.includes("successfully")
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl text-center bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
                placeholder="Enter new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold uppercase hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <Link to={"/create-listing"}>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold uppercase hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg">
                Create New Listing
              </button>
            </Link>

            <div className="flex justify-between mt-8 text-sm">
              <span
                onClick={handleDeleteAccount}
                className="text-red-500 hover:text-red-600 cursor-pointer font-medium transition-colors"
              >
                Delete Account
              </span>
              <span
                onClick={handleMyListings}
                className="text-slate-600 hover:text-slate-800 cursor-pointer font-medium transition-colors"
              >
                {loadingListings ? "Loading..." : "My Listings"}
              </span>
              <span
                onClick={handleSignOut}
                className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors"
              >
                Sign Out
              </span>
            </div>

            {mylistingserror && (
              <p className="text-red-500 text-center text-sm mt-2">
                Error showing listings
              </p>
            )}
          </form>
        ) : (
          // Listings View - List Format Only
          <div className="mt-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  My Listings
                </h2>
                <p className="text-gray-600 mt-1">
                  {userslistings.length}{" "}
                  {userslistings.length === 1 ? "property" : "properties"}{" "}
                  listed
                </p>
              </div>

              <button
                onClick={() => setShowListings(false)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all transform hover:scale-105 shadow-lg font-medium"
              >
                Back to Profile
              </button>
            </div>

            {message && (
              <div
                className={`p-4 rounded-xl text-center mb-6 shadow-md ${
                  message.includes("successfully")
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {userslistings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No listings yet
                </h3>
                <p className="text-gray-500 text-lg mb-6">
                  Start your real estate journey by creating your first listing
                </p>
                <Link to="/create-listing">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-semibold">
                    Create Your First Listing
                  </button>
                </Link>
              </div>
            ) : (
              // List View Only
              <div className="space-y-4">
                {userslistings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative md:w-80 h-64 md:h-auto overflow-hidden">
                        {listing.imageUrls && listing.imageUrls[0] ? (
                          <img
                            src={listing.imageUrls[0]}
                            alt={listing.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Type Badge */}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                          {listing.type}
                        </div>

                        {listing.offer && (
                          <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">
                            Special Offer
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                              {listing.name}
                            </h3>
                          </div>

                          <p className="text-gray-600 mb-3 flex items-center">
                            <svg
                              className="w-4 h-4 mr-2 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {listing.address}
                          </p>

                          <div className="text-3xl font-bold text-blue-600 mb-4">
                            {formatPrice(listing)}
                            {listing.type === "rent" && (
                              <span className="text-lg text-gray-500 font-normal">
                                /month
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {listing.description && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {listing.description}
                            </p>
                          )}

                          {/* Property Features */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                            <div className="flex items-center text-gray-600">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"
                                />
                              </svg>
                              <span className="font-medium">
                                {listing.bedrooms}
                              </span>
                              <span className="ml-1">
                                Bed{listing.bedrooms !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1M21 3l-9 9-9-9"
                                />
                              </svg>
                              <span className="font-medium">
                                {listing.bathrooms}
                              </span>
                              <span className="ml-1">
                                Bath{listing.bathrooms !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {listing.parking && (
                              <div className="flex items-center text-gray-600">
                                <svg
                                  className="w-5 h-5 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Parking</span>
                              </div>
                            )}
                            {listing.furnished && (
                              <div className="flex items-center text-gray-600">
                                <svg
                                  className="w-5 h-5 mr-2 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Furnished</span>
                              </div>
                            )}
                          </div>

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                            {listing.regularPrice &&
                              listing.discountedprice &&
                              listing.regularPrice !==
                                listing.discountedprice && (
                                <div className="flex items-center">
                                  <span className="text-gray-500">
                                    Regular Price:
                                  </span>
                                  <span className="ml-2 line-through text-gray-400">
                                    {formatPrice({
                                      regularPrice: listing.regularPrice,
                                    })}
                                  </span>
                                </div>
                              )}
                            {listing.createdAt && (
                              <div className="flex items-center">
                                <span className="text-gray-500">Listed:</span>
                                <span className="ml-2 font-medium">
                                  {new Date(
                                    listing.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3 mt-auto">
                            <Link
                              to={`/create-listing/${listing._id}`}
                              className="flex-1"
                            >
                              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-xl hover:bg-green-600 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]">
                                Edit Listing
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteListing(listing._id)}
                              className="bg-red-500 text-white py-3 px-4 rounded-xl hover:bg-red-600 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;