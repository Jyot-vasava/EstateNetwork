import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularprice: 500,
    discountedprice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // Common handler for form fields
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
      console.log(updatedFormData);
      return;
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
      console.log(updatedFormData);
      return;
    }

    // For number, text or textarea input
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
      console.log(updatedFormData);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 6) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }

    if (files.length === 0) {
      setImageUploadError("Please select at least one image");
      return;
    }

    setImageFiles(files);
    setImageUploadError(false);
  };

  // Upload images to server
  const handleImageSubmit = async () => {
    if (imageFiles.length === 0) {
      setImageUploadError("Please select at least one image");
      return;
    }

    if (imageFiles.length > 6) {
      setImageUploadError("You can only upload 6 images per listing");
      return;
    }

    setUploading(true);
    setImageUploadError(false);

    try {
      const promises = [];

      for (let i = 0; i < imageFiles.length; i++) {
        promises.push(storeImage(imageFiles[i]));
      }

      const urls = await Promise.all(promises);
      setFormData({
        ...formData,
        imageUrls: urls,
      });
      setImageUploadError(false);
      setUploading(false);
    } catch (error) {
      setImageUploadError("Image upload failed (2 MB max per image)");
      setUploading(false);
    }
  };

  // Store individual image
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("images", file);

      fetch(
        `https://estate-network-backend-api.onrender.com/api/listing/upload-images`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.urls && data.urls.length > 0) {
            resolve(data.urls[0]);
          } else {
            reject(new Error("Failed to upload image"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Submit handler: sends form data with uploaded image URLs
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if images are uploaded
      if (!formData.imageUrls || formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }

      if (formData.imageUrls.length > 6) {
        return setError("You can only upload 6 images per listing");
      }

      // Validate pricing
      if (+formData.regularprice < +formData.discountedprice) {
        return setError("Discount price must be lower than regular price");
      }

      setLoading(true);
      setError(false);

      const res = await fetch(
        `https://estate-network-backend-api.onrender.com/api/listing/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            imageurl: formData.imageUrls,
            userRef: user._id,
          }),
        }
      );
      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/listings/${data.listing._id}`);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  const handleRemoveImage = (index) => {
    const newUrls = [...formData.imageUrls];
    newUrls.splice(index, 1);
    setFormData({ ...formData, imageUrls: newUrls });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Listing
          </h1>
          <p className="text-xl text-gray-300">
            List your property with us and reach thousands of potential buyers
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl"
        >
          {/* Left side: main form */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <input
              type="text"
              placeholder="Property Name"
              className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              id="name"
              maxLength="62"
              minLength="5"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              placeholder="Property Description"
              className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 min-h-[120px] resize-none"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Property Address"
              className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5 h-5 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span className="text-white font-medium">Sell</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5 h-5 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <span className="text-white font-medium">Rent</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 h-5 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span className="text-white font-medium">Parking</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 h-5 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span className="text-white font-medium">Furnished</span>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5 h-5 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500 focus:ring-2"
                  onChange={handleChange}
                  checked={formData.offer}
                />
                <span className="text-white font-medium">Offer</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[130px]">
                <label className="font-semibold block text-white text-sm mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  required
                  className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div className="flex-1 min-w-[130px]">
                <label className="font-semibold block text-white text-sm mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  required
                  className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="font-semibold block text-white text-sm mb-2">
                  Regular Price{" "}
                  {formData.type === "rent" && (
                    <span className="text-xs text-gray-300">(₹ / month)</span>
                  )}
                </label>
                <input
                  type="number"
                  id="regularprice"
                  required
                  className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  min="50"
                  max="10000000"
                  onChange={handleChange}
                  value={formData.regularprice}
                />
              </div>
              {formData.offer && (
                <div className="flex-1 min-w-[180px]">
                  <label className="font-semibold block text-white text-sm mb-2">
                    Discounted Price{" "}
                    {formData.type === "rent" && (
                      <span className="text-xs text-gray-300">(₹ / month)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    id="discountedprice"
                    required
                    className="w-full bg-white/20 backdrop-blur-lg border border-white/30 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    min="0"
                    max="10000000"
                    onChange={handleChange}
                    value={formData.discountedprice}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right side: Image upload and preview */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div>
              <p className="font-semibold text-white text-lg mb-2">
                Property Images
              </p>
              <p className="text-sm text-gray-300">
                The first image will be the cover photo (max 6 images)
              </p>
            </div>

            <div className="flex gap-4">
              <input
                onChange={handleImageChange}
                className="flex-1 bg-white/20 backdrop-blur-lg border border-white/30 text-white p-3 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all duration-300"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {imageUploadError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl">
                <p className="text-sm">{imageUploadError}</p>
              </div>
            )}

            {formData.imageUrls &&
              formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between items-center p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-white/30"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              ))}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {loading ? "Creating Listing..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListing;
