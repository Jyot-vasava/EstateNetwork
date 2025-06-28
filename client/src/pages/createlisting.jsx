import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

      fetch("/api/listing/upload-images", {
        method: "POST",
        body: formData,
      })
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

    try {
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageurl: formData.imageUrls,
          userRef: user._id,
        }),
      });
      const data = await res.json();

      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        // Navigate to home page after successful creation
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Listing</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl flex flex-col md:flex-row gap-10 bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Left side: main form */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition min-h-[120px]"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            <div className="flex-1 min-w-[130px]">
              <label className="font-semibold block text-sm">Beds</label>
              <input
                type="number"
                id="bedrooms"
                required
                className="w-full mt-1 p-3 rounded-lg border transition-all"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
              />
            </div>
            <div className="flex-1 min-w-[130px]">
              <label className="font-semibold block text-sm">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                required
                className="w-full mt-1 p-3 rounded-lg border transition-all"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bathrooms}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="font-semibold block text-sm">
                Regular Price{" "}
                {formData.type === "rent" && (
                  <span className="text-xs">(₹ / month)</span>
                )}
              </label>
              <input
                type="number"
                id="regularprice"
                required
                className="w-full mt-1 p-3 rounded-lg border transition-all"
                min="50"
                max="10000000"
                onChange={handleChange}
                value={formData.regularprice}
              />
            </div>
            {formData.offer && (
              <div className="flex-1 min-w-[180px]">
                <label className="font-semibold block text-sm">
                  Discounted Price{" "}
                  {formData.type === "rent" && (
                    <span className="text-xs">(₹ / month)</span>
                  )}
                </label>
                <input
                  type="number"
                  id="discountedprice"
                  required
                  className="w-full mt-1 p-3 rounded-lg border transition-all"
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
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <p className="font-semibold">
            Images:
            <span className="text-sm text-gray-500 ml-1">
              (The first image will be cover - max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleImageChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls &&
            formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          {error && <p className="text-red-700 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full p-3 rounded-lg border bg-slate-700 text-white hover:opacity-95 disabled:opacity-80 uppercase"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>
    </main>
  );

  // Handle remove image
  function handleRemoveImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }
};

export default CreateListing;