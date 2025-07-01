// import { useSelector, useDispatch } from "react-redux";
// import { useState, useRef, useEffect } from "react";
// import {
//   updateUserStart,
//   updateUserSuccess,
//   updateUserFailure,
//   deleteUserStart,
//   deleteUserSuccess,
//   deleteUserFailure,
//   signOut,
// } from "../redux/user/userSlice";
// import { Link, Navigate } from "react-router-dom";

// const Profile = () => {
//   const { user, loading, error } = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   // Initialize formData with user data
//   const [formData, setFormData] = useState({
//     username: user?.username || "",
//     email: user?.email || "",
//     password: "",
//     profilePicture: user?.profilePicture || "",
//   });

//   const [profileImage, setProfileImage] = useState(user?.profilePicture);
//   const [imageFile, setImageFile] = useState(null);
//   const [message, setMessage] = useState("");
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const fileInputRef = useRef(null);

//   const [showListingserror, setShowListingserror] = useState(false);
//   const [userListings, setUserListings] = useState([]); 

  

//   // Update formData when user changes
//   useEffect(() => {
//     setFormData({
//       username: user?.username || "",
//       email: user?.email || "",
//       password: "",
//       profilePicture: user?.profilePicture || "",
//     });
//   }, [user]);

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setProfileImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadImageToCloudinary = async (file) => {
//     const formDataImg = new FormData();
//     formDataImg.append("file", file);
//     formDataImg.append(
//       "upload_preset",
//       process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
//     );
//     formDataImg.append("folder", "profile_images");

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formDataImg,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to upload image");
//       }

//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error.message);
//       }
//       return data.secure_url;
//     } catch (error) {
//       throw new Error("Failed to upload image: " + error.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(updateUserStart());
//       let updatedFormData = { ...formData };

//       if (imageFile) {
//         try {
//           setUploadingImage(true);
//           const imageUrl = await uploadImageToCloudinary(imageFile);
//           updatedFormData.profilePicture = imageUrl;
//           setMessage("Image uploaded successfully!");
//         } catch (error) {
//           setUploadingImage(false);
//           dispatch(
//             updateUserFailure("Failed to upload image: " + error.message)
//           );
//           return;
//         } finally {
//           setUploadingImage(false);
//         }
//       }

//       if (!updatedFormData.password) {
//         delete updatedFormData.password;
//       }

//       const response = await fetch(`/api/user/update/${user._id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(updatedFormData),
//       });

//       const data = await response.json();

//       if (!response.ok || data.success === false) {
//         dispatch(updateUserFailure(data.message || "Update failed"));
//         return;
//       }

//       dispatch(updateUserSuccess(data));
//       setMessage("Profile updated successfully!");
//       setImageFile(null);
//       setFormData({
//         username: data.username || "",
//         email: data.email || "",
//         password: "",
//         profilePicture: data.profilePicture || "",
//       });
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       dispatch(updateUserFailure(error.message));
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (window.confirm("Are you sure you want to delete your account?")) {
//       try {
//         dispatch(deleteUserStart());
//         const response = await fetch(`/api/user/delete/${user._id}`, {
//           method: "DELETE",
//           credentials: "include",
//         });
//         const data = await response.json();

//         if (data.success) {
//           dispatch(deleteUserSuccess());
//           setMessage("Account deleted successfully");
//         } else {
//           dispatch(deleteUserFailure(data.message));
//           setMessage(data.message || "Failed to delete account");
//         }
//       } catch (error) {
//         dispatch(deleteUserFailure(error.message));
//         setMessage("An error occurred while deleting account");
//       }
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await fetch("/api/auth/signout", {
//         method: "POST",
//         credentials: "include",
//       });
//       dispatch(signOut());

//       window.location.replace("/signin");
//     } catch (error) {
//       console.log("Error signing out:", error);
//     }
//   };

//   const handleShowListings = async () => {
//      try {
//           setShowListingserror(false);
//           const response = await fetch(`/api/user/listings/${user._id}`);
//           const data = await response.json();

//           if (data.success === false) {
//             setShowListingserror(true);
//             return;
//           }
//           setUserListings(data);
//      } catch (error) {
//         setShowListingserror(true);
//      }
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
//         {/* Background decoration */}
//         <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-200/30 to-blue-200/30 rounded-full blur-2xl"></div>

//         {/* Profile Form */}
//         <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
//           <div className="flex flex-col items-center">
//             <div
//               className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer group ring-4 ring-white"
//               onClick={handleImageClick}
//             >
//               <img
//                 src={profileImage || user?.image}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                 <span className="text-white text-sm font-medium">
//                   Change Photo
//                 </span>
//               </div>
//             </div>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               className="hidden"
//             />
//             <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
//               {formData.username}
//             </h1>
//             <p className="text-gray-500 text-sm">{formData.email}</p>
//           </div>

//           {message && (
//             <div
//               className={`p-4 rounded-xl text-center shadow-md ${
//                 message.includes("successfully")
//                   ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
//                   : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"
//               }`}
//             >
//               {message}
//             </div>
//           )}

//           {error && (
//             <div className="p-4 rounded-xl text-center bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={formData.username}
//               onChange={handleInputChange}
//               className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Password (leave blank to keep current)
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-sm"
//               placeholder="Enter new password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold uppercase hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 shadow-lg"
//           >
//             {loading ? "Updating..." : "Update Profile"}
//           </button>

//           <Link to={"/create-listing"}>
//             <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold uppercase hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] shadow-lg">
//               Create New Listing
//             </button>
//           </Link>

//             </form>
//           <div className="flex justify-between mt-8 text-sm">
//             <span
//               onClick={handleDeleteAccount}
//               className="text-red-500 hover:text-red-600 cursor-pointer font-medium transition-colors"
//             >
//               Delete Account
//             </span>

//             <span
//               onClick={handleShowListings}
//               className="text-green-500 hover:text-green-600 cursor-pointer font-medium transition-colors"
//             >
//               Show Listings
//             </span>
            

//             <span
//               onClick={handleSignOut}
//               className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors"
//             >
//               Sign Out
//             </span>
//           </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

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

  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      profilePicture: user?.profilePicture || "",
    });
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
    const formDataImg = new FormData();
    formDataImg.append("file", file);
    formDataImg.append(
      "upload_preset",
      process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
    );
    formDataImg.append("folder", "profile_images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
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
        setMessage("Image uploaded successfully!");
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
      setShowListingserror(false);
      const response = await fetch(`/api/user/listings/${user._id}`);
      const data = await response.json();
      if (data.success === false) {
        setShowListingserror(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingserror(true);
    }
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
            Show Listings
          </span>
          <span
            onClick={handleSignOut}
            className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors"
          >
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
