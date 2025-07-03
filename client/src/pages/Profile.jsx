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

      const response = await fetch(`/api/user/update/${user._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedFormData),
      });

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
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      dispatch(signOut());
      window.location.replace("/signin");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  const handleShowListings = async () => {
    try {
      setListingsLoading(true);
      setShowListingserror(false);
      const response = await fetch(`/api/user/listings/${user._id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success === false) {
        setShowListingserror(true);
        setListingsLoading(false);
        return;
      }
      console.log("User listings:", data);
      setUserListings(data);
      setListingsLoading(false);
    } catch (error) {
      setShowListingserror(true);
      setListingsLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include",
      });
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-200/30 to-blue-200/30 rounded-full blur-2xl"></div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
          <div className="flex flex-col items-center">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer group ring-4 ring-white"
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
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">
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
            <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {formData.username}
            </h1>
            <p className="text-gray-500 text-sm">{formData.email}</p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-xl text-center shadow-md ${message.includes("successfully")
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
            disabled={loading || uploadingImage}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold uppercase hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
          >
            {uploadingImage
              ? "Uploading Image..."
              : loading
                ? "Updating..."
                : "Update Profile"}
          </button>

          <Link to={"/create-listing"}>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold uppercase hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg">
              Create New Listing
            </button>
          </Link>
        </form>

        <div className="flex justify-between mt-8 text-sm">
          <span
            onClick={handleDeleteAccount}
            className="text-red-500 hover:text-red-600 cursor-pointer font-medium transition-colors"
          >
            Delete Account
          </span>
          <span
            onClick={handleShowListings}
            className="text-green-500 hover:text-green-600 cursor-pointer font-medium transition-colors"
          >
            {listingsLoading ? "Loading..." : "Show Listings"}
          </span>
          <span
            onClick={handleSignOut}
            className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors"
          >
            Sign Out
          </span>
        </div>

        {/* Enhanced Show listings section */}
        {userListings.length > 0 && (
          <div className="mt-12 relative z-10">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Your Listings ({userListings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.imageurl[0] || "/api/placeholder/400/300"}
                      alt={listing.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.type === "rent"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                          }`}
                      >
                        {listing.type === "rent" ? "For Rent" : "For Sale"}
                      </span>
                    </div>
                    {listing.offer && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Offer
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                      {listing.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.parking && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          🚗 Parking
                        </span>
                      )}
                      {listing.furnished && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          🪑 Furnished
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link to={`/update-listing/${listing._id}`}>
                      ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No listings message */}
        {userListings.length === 0 &&
          !listingsLoading &&
          !showListingserror && (
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-gray-600 text-lg">No listings found</p>
                <p className="text-gray-500 text-sm mt-2">
                  Click "Show Listings" to refresh or create your first listing
                </p>
              </div>
            </div>
          )}

        {showListingserror && (
          <div className="mt-4 p-4 rounded-xl text-center bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200">
            ❌ Error showing listings. Please try again.
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Profile;
