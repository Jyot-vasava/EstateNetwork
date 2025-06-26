import React from "react";

const CreateListing = () => {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Create Listing</h1>

      {/* Wrapper for left-right layout */}
      <form className="w-full max-w-6xl flex flex-col md:flex-row gap-10 bg-white p-6 rounded-lg ">
        {/* Left side: main form  */}

        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            id="name"
            maxLength="62"
            minLength="5"
            required
          />
          <textarea
            placeholder="Description"
            className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            id="address"
            required
          />

          <div className="flex gap-5 flex-wrap">
            {[
              { id: "sale", label: "Sell" },
              { id: "rent", label: "Rent" },
              { id: "parking", label: "Parking" },
              { id: "furnishing", label: "Furnishing" },
              { id: "offer", label: "Offer" },
            ].map((item) => (
              <div key={item.id} className="flex gap-2 items-center">
                <input type="checkbox" id={item.id} className="w-5" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-5">
            {[
              { id: "Beds", label: "Beds", min: 1, max: 10 },
              { id: "Bathrooms", label: "Bathrooms", min: 1, max: 10 },
              {
                id: "RegularPrice",
                label: "Regular Price",
                min: 50,
                max: 10000000,
              },
              {
                id: "DiscountPrice",
                label: "Discount Price",
                min: 50,
                max: 10000000,
              },
            ].map((field) => (
              <div key={field.id} className="flex-1 min-w-[130px]">
                <label className="block text-sm text-gray-700">
                  {field.label}
                </label>
                <input
                  type="number"
                  id={field.id}
                  required
                  className="w-40 mt-1 p-3 rounded-lg border transition-all"
                  min={field.min}
                  max={field.max}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right side: image upload */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <p className="font-semibold">
            Images:
            <span className="text-sm text-gray-500 ml-1">
              (The first image will be cover - max 6)
            </span>
          </p>

          <div className="flex gap-3 items-center">
            <input
              className="p-3 border rounded-lg transition-all w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              required
            />

            <button
              type="button"
              className="p-3 rounded-lg border bg-gray-500 text-white hover:opacity-75 whitespace-nowrap"
            >
              Upload Images
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-lg border bg-blue-500 text-white hover:opacity-75 mt-5"
          >
            Create Listing
          </button>
        </div>

      </form>
    </main>
  );
};

export default CreateListing;
