import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import config from "../../config";

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularprice: 0,
    discountedprice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageurl: [],
  });

  // Fetch listing data on component mount
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        // Fixed: Use the correct API endpoint
        const res = await fetch(`${config.BACKEND_API}/api/listing/get/${id}`);
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch listing");
          return;
        }

        // Check if user owns the listing
        if (data.userRef !== user._id) {
          toast.error("You can only edit your own listings");
          navigate("/profile");
          return;
        }

        // Update form data with fetched listing data
        setFormData(data);
      } catch (error) {
        toast.error("Failed to fetch listing");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && user?._id) {
      fetchListing();
    }
  }, [id, user?._id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async () => {
    if (images.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    if (images.length + formData.imageurl.length > 6) {
      toast.error("You can only upload maximum 6 images");
      return;
    }

    try {
      setUploading(true);
      const formDataToSend = new FormData();

      for (let i = 0; i < images.length; i++) {
        formDataToSend.append("images", images[i]);
      }

      const res = await fetch(
        "${config.BACKEND_API}/api/listing/upload-images",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      const data = await res.json();

      if (data.success === false) {
        toast.error(data.error || "Failed to upload images");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageurl: [...prev.imageurl, ...data.urls],
      }));

      setImages([]);
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageurl: prev.imageurl.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageurl.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (formData.offer && formData.regularprice <= formData.discountedprice) {
      toast.error("Discount price must be lower than regular price");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${config.BACKEND_API}/api/listing/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message || "Failed to update listing");
        return;
      }

      toast.success(data.message || "Listing updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update listing");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex justify-center items-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Update{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Listing
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Make changes to your property listing and keep it up to date
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Property Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Property Type
                </label>
                <div className="flex gap-8">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value="rent"
                      checked={formData.type === "rent"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                      For Rent
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value="sale"
                      checked={formData.type === "sale"}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                      For Sale
                    </span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amenities & Features
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="furnished"
                      checked={formData.furnished}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                      Furnished
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="parking"
                      checked={formData.parking}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                      Parking Available
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="offer"
                      checked={formData.offer}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    />
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                      Special Offer
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Pricing Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Regular Price (INR)
                  </label>
                  <input
                    type="number"
                    name="regularprice"
                    value={formData.regularprice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                  />
                </div>

                {formData.offer && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Discounted Price (INR)
                    </label>
                    <input
                      type="number"
                      name="discountedprice"
                      value={formData.discountedprice}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Property Images
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Images (Maximum 6)
                </label>
                <div className="flex gap-4 mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    {uploading ? "Uploading..." : "Upload Images"}
                  </button>
                </div>

                {/* Display uploaded images */}
                {formData.imageurl.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.imageurl.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-gray-200 group-hover:shadow-lg transition-shadow duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors duration-300 shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? "Updating Listing..." : "Update Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateListing;