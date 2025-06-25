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

const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(user?.image);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
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
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"
    );
    formData.append("folder", "profile_images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    dispatch(updateUserStart());

    try {
      let imageUrl = user.image;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const updateData = {
        username: formData.username,
        email: formData.email,
        image: imageUrl,
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`/api/user/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(updateUserSuccess(data.user));
        setMessage("Profile updated successfully!");
        setFormData({ ...formData, password: "" });
        setImageFile(null);
      } else {
        dispatch(updateUserFailure(data.message));
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setMessage("An error occurred while updating profile");
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

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-slate-100 rounded-2xl shadow-xl p-8 relative">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex flex-col items-center">
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer group"
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
            <h1 className="text-2xl font-bold mt-4">{formData.username}</h1>
            <p className="text-gray-500 text-sm">{formData.email}</p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-center ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg text-center bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Password (leave blank to keep current)
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold uppercase hover:opacity-75 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <span
            onClick={handleDeleteAccount}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;