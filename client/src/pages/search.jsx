import React, { useState, useEffect } from "react";

const Search = () => {
  // State for sidebar data
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: {
      rent: false,
      sell: false,
      offer: false,
      parking: false,
      furnished: false,
    },
    sort: "regularprice_desc",
  });

  // State for search results
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value, checked, type } = e.target;

    if (id === "searchTerm") {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: value,
      }));
    }

    if (id === "sort") {
      setSidebarData((prev) => ({
        ...prev,
        sort: value,
      }));
    }

    if (type === "checkbox") {
      setSidebarData((prev) => ({
        ...prev,
        type: {
          ...prev.type,
          [id]: checked,
        },
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("sort", sidebarData.sort);

      // Add type filters to URL params
      Object.entries(sidebarData.type).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, "true");
        }
      });

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return;
      }

      setListings(data);
      setLoading(false);
      setShowMore(data.length === 9); // Show "Show More" if we have 9 results (assuming limit is 9)
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
    }
  };

  // Handle URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const sortFromUrl = urlParams.get("sort");
    const rentFromUrl = urlParams.get("rent");
    const sellFromUrl = urlParams.get("sell");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      sortFromUrl ||
      rentFromUrl ||
      sellFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: {
          rent: rentFromUrl === "true",
          sell: sellFromUrl === "true",
          offer: offerFromUrl === "true",
          parking: parkingFromUrl === "true",
          furnished: furnishedFromUrl === "true",
        },
        sort: sortFromUrl || "regularprice_desc",
      });
    }

    // Fetch listings on component mount
    fetchListings();
  }, []);

  // Fetch listings function
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/listing/get");
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return;
      }

      setListings(data);
      setLoading(false);
      setShowMore(data.length === 9);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
    }
  };

  // Handle show more listings
  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;

    setLoading(true);
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);
      urlParams.set("sort", sidebarData.sort);
      urlParams.set("startIndex", startIndex);

      // Add type filters to URL params
      Object.entries(sidebarData.type).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, "true");
        }
      });

      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        return;
      }

      if (data.length < 9) {
        setShowMore(false);
      }

      setListings((prev) => [...prev, ...data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more listings:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5"
                  checked={sidebarData.type.rent}
                  onChange={handleChange}
                />
                <label htmlFor="rent" className="whitespace-nowrap">
                  Rent
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="sell"
                  className="w-5"
                  checked={sidebarData.type.sell}
                  onChange={handleChange}
                />
                <label htmlFor="sell" className="whitespace-nowrap">
                  Sell
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5"
                  checked={sidebarData.type.offer}
                  onChange={handleChange}
                />
                <label htmlFor="offer" className="whitespace-nowrap">
                  Offer
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5"
                  checked={sidebarData.type.parking}
                  onChange={handleChange}
                />
                <label htmlFor="parking" className="whitespace-nowrap">
                  Parking
                </label>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5"
                  checked={sidebarData.type.furnished}
                  onChange={handleChange}
                />
                <label htmlFor="furnished" className="whitespace-nowrap">
                  Furnished
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort"
              className="border rounded-lg p-3"
              value={sidebarData.sort}
              onChange={handleChange}
            >
              <option value="regularprice_desc">Price high to low</option>
              <option value="regularprice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && listings.length === 0 ? (
            <p className="text-slate-600">Searching...</p>
          ) : listings.length === 0 ? (
            <p className="text-slate-600">
              No listings found. Try adjusting your search criteria.
            </p>
          ) : (
            <>
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]"
                >
                  <img
                    src={
                      listing.imageurl[0] ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={listing.name}
                    className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                  />
                  <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="truncate text-lg font-semibold text-slate-700">
                      {listing.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4 text-green-700"
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
                      <p className="text-sm text-gray-600 truncate">
                        {listing.address}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {listing.description}
                    </p>
                    <p className="text-slate-500 mt-2 font-semibold">
                      $
                      {listing.offer
                        ? listing.discountedprice.toLocaleString()
                        : listing.regularprice.toLocaleString()}
                      {listing.type === "rent" && " / month"}
                    </p>
                    <div className="text-slate-700 flex gap-4">
                      <div className="font-bold text-xs">
                        {listing.bedrooms > 1
                          ? `${listing.bedrooms} beds`
                          : `${listing.bedrooms} bed`}
                      </div>
                      <div className="font-bold text-xs">
                        {listing.bathrooms > 1
                          ? `${listing.bathrooms} baths`
                          : `${listing.bathrooms} bath`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="text-green-700 hover:underline p-7 text-center w-full"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Show more"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
