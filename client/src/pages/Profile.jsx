import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
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
import { Toaster } from "react-hot-toast";
import config from "../../config";

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    profilePicture: user?.profilePicture || "",
  });

  const [profileImage, setProfileImage] = useState(user?.profilePicture);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [showListingserror, setShowListingserror] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      profilePicture: user?.profilePicture || "",
    });
    setProfileImage(user?.profilePicture);
  }, [user]);

  // Auto-hide message and error after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        dispatch(updateUserFailure(null)); // clear error in Redux
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    // Check if environment variables are available
    const cloudName = "dyoeatidf";
    const uploadPreset = "unsigned_preset";

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary configuration missing. Please check your environment variables."
      );
    }

    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append("upload_preset", uploadPreset);
    formDataImg.append("folder", "profile_images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formDataImg }
      );

      const data = await response.json();
      if (!response.ok || data.error)
        throw new Error(data.error?.message || "Upload failed");
      return data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    let updatedFormData = { ...formData };

    try {
      if (imageFile) {
        setUploadingImage(true);
        const imageUrl = await uploadImageToCloudinary(imageFile);
        updatedFormData.profilePicture = imageUrl;
        setUploadingImage(false);
      }

      if (!updatedFormData.password) delete updatedFormData.password;

      const response = await fetch(
        `https://estate-network-backend-api.onrender.com/api/user/update/${user._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedFormData),
        }
      );

      const data = await response.json();
      if (!response.ok || data.success === false) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        setUploadingImage(false);
        return;
      }

      // Update Redux state with new user data
      dispatch(updateUserSuccess(data));
      setMessage("Profile updated successfully!");
      setImageFile(null);

      // Update local state to reflect changes
      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: "",
        profilePicture: data.profilePicture || "",
      });
      setProfileImage(data.profilePicture);
    } catch (error) {
      console.error("Error updating profile:", error);
      dispatch(updateUserFailure(error.message));
      setUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      dispatch(deleteUserStart());
      const response = await fetch(
        `https://estate-network-backend-api.onrender.com/api/user/delete/${user._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        dispatch(deleteUserSuccess());
        window.location.replace("/signin");
        setMessage("Account deleted successfully");
      } else {
        dispatch(deleteUserFailure(data.message));
        setMessage(data.message || "Failed to delete account");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setMessage("An error occurred while deleting account");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch(
        `https://estate-network-backend-api.onrender.com/api/auth/signout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      dispatch(signOut());
      window.location.replace("/signin");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  // FIXED: Updated the handleShowListings function with proper error handling and API endpoint
  const handleShowListings = async () => {
    try {
      setListingsLoading(true);
      setShowListingserror(false);

      // Fetch user's listings from API endpoint
      const response = await fetch(
        `https://estate-network-backend-api.onrender.com/api/listing/user/${user._id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle different response structures
      let listings = [];
      if (Array.isArray(data)) {
        listings = data;
      } else if (data.success && Array.isArray(data.listings)) {
        listings = data.listings;
      } else if (data.listings && Array.isArray(data.listings)) {
        listings = data.listings;
      } else {
        console.warn("Unexpected response format:", data);
        listings = [];
      }

      setUserListings(listings);
      setListingsLoading(false);

      if (listings.length === 0) {
        setMessage("No listings found for your account.");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setShowListingserror(true);
      setListingsLoading(false);
      setMessage(error.message || "Failed to load listings. Please try again.");
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://estate-network-backend-api.onrender.com/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setUserListings(
          userListings.filter((listing) => listing._id !== listingId)
        );
        setMessage("Listing deleted successfully!");
      } else {
        setMessage(data.message || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      setMessage("An error occurred while deleting listing");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200/30 to-blue-200/30 rounded-full blur-2xl"></div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group ring-4 ring-blue-700"
                onClick={handleImageClick}
              >
                <img
                  src={
                    profileImage ||
                    user?.profilePicture ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-semibold">
                    {uploadingImage ? "Uploading..." : "Change Photo"}
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
              <h1 className="text-4xl font-bold mt-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-900">
                {formData.username}
              </h1>
              <p className="text-gray-600 text-lg mt-2">{formData.email}</p>
            </div>

            {/* Alert Messages */}
            {message && (
              <div
                className={`p-4 rounded-2xl text-center shadow-lg ${
                  message.includes("successfully")
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl text-center bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 shadow-lg">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-2xl font-semibold uppercase hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {uploadingImage
                  ? "Uploading Image..."
                  : loading
                  ? "Updating..."
                  : "Update Profile"}
              </button>

              <Link to={"/create-listing"} className="block">
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl font-semibold uppercase hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Create New Listing
                </button>
              </Link>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4 text-sm">
            <span
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-700 cursor-pointer font-semibold transition-colors duration-300 hover:underline"
            >
              Delete Account
            </span>
            <span
              onClick={handleShowListings}
              className="text-blue-700 hover:text-blue-800 cursor-pointer font-semibold transition-colors duration-300 hover:underline"
            >
              {listingsLoading ? "Loading..." : "Show Listings"}
            </span>
            <span
              onClick={handleSignOut}
              className="text-slate-600 hover:text-slate-700 cursor-pointer font-semibold transition-colors duration-300 hover:underline"
            >
              Sign Out
            </span>
          </div>

          {/* Listings Section */}
          {userListings.length > 0 && (
            <div className="mt-16 relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Your Listings ({userListings.length})
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-700 to-yellow-700 mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group border border-gray-100"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          listing.imageurl?.[0] ||
                          listing.images?.[0] ||
                          "/api/placeholder/400/300"
                        }
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                            listing.type === "rent"
                              ? "bg-blue-700 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {listing.type === "rent" ? "For Rent" : "For Sale"}
                        </span>
                      </div>
                      {listing.offer && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            Special Offer
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2">
                        {listing.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-1">
                        📍 {listing.address}
                      </p>

                      {/* Price Section */}
                      <div className="mb-4">
                        {listing.offer ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(listing.discountedprice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(listing.regularprice)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-green-600">
                            {formatPrice(listing.regularprice)}
                          </span>
                        )}
                        {listing.type === "rent" && (
                          <span className="text-sm text-gray-500 ml-1">
                            /month
                          </span>
                        )}
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          🛏️ {listing.bedrooms} bed
                          {listing.bedrooms !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          🚿 {listing.bathrooms} bath
                          {listing.bathrooms !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {listing.parking && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            🚗 Parking
                          </span>
                        )}
                        {listing.furnished && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                            🪑 Furnished
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          to={`/update-listing/${listing._id}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] text-sm text-center shadow-lg"
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-[1.02] text-sm shadow-lg"
                        >
                          🗑️ Delete
                        </button>
                        <Link
                          to={`/listings/${listing._id}`}
                          className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-slate-700 hover:to-slate-800 transition-all duration-300 transform hover:scale-[1.02] text-sm text-center shadow-lg"
                        >
                          👁️ View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Listings Message */}
          {userListings.length === 0 &&
            !listingsLoading &&
            !showListingserror && (
              <div className="mt-16 text-center">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl p-12 shadow-lg">
                  <div className="text-8xl mb-6">🏠</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    No Listings Found
                  </h3>
                  <p className="text-gray-600 text-lg mb-4">
                    You haven't created any listings yet
                  </p>
                  <p className="text-gray-500 text-sm">
                    Click "Show Listings" to refresh or create your first
                    listing
                  </p>
                </div>
              </div>
            )}

          {/* Error Message */}
          {showListingserror && (
            <div className="mt-8 p-6 rounded-2xl text-center bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 shadow-lg">
              <div className="text-4xl mb-2">❌</div>
              <p className="font-semibold">Error loading listings</p>
              <p className="text-sm mt-1">Please try again later</p>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Profile;
