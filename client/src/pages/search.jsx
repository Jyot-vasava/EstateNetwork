import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/listingitem";
import config from "../../config";

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
    sort: "createdAt_desc",
  });

  // State for search results
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sidebarData.searchTerm);

      // Parse sort to get field and order
      const [sortField, sortOrder] = sidebarData.sort.split("_");
      urlParams.set("sort", sortField);
      urlParams.set("order", sortOrder);

      // Set type parameters
      Object.entries(sidebarData.type).forEach(([key, value]) => {
        if (value) {
          urlParams.set(key, value.toString());
        }
      });

      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);

      const res = await fetch(
        `${config.BACKEND_API}/api/listing/get?${searchQuery}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setListings(data);
      setLoading(false);
      setShowMore(data.length === 9); // Show "Show More" if we have 9 results
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to fetch listings. Please try again.");
      setLoading(false);
    }
  };

  // Handle URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const rentFromUrl = urlParams.get("rent");
    const sellFromUrl = urlParams.get("sell");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");

    // Update sidebar data with URL parameters
    setSidebarData({
      searchTerm: searchTermFromUrl || "",
      type: {
        rent: rentFromUrl === "true",
        sell: sellFromUrl === "true",
        offer: offerFromUrl === "true",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
      },
      sort:
        sortFromUrl && orderFromUrl
          ? `${sortFromUrl}_${orderFromUrl}`
          : "createdAt_desc",
    });

    // Fetch listings function
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(
          `${config.BACKEND_API}/api/listing/get?${searchQuery}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        setListings(data);
        setShowMore(data.length === 9);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("Failed to fetch listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch listings on component mount
    fetchListings();
  }, [window.location.search]);

  // Handle show more listings
  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;

    setLoading(true);
    setError(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("startIndex", startIndex.toString());

      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${config.BACKEND_API}/api/listing/get?${searchQuery}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.length < 9) {
        setShowMore(false);
      }

      setListings((prev) => [...prev, ...data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more listings:", error);
      setError("Failed to load more listings. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="bg-white p-8 border-b-2 border-gray-200 md:border-b-0 md:border-r-2 md:min-h-screen md:w-80 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search properties..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Property Type:
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={sidebarData.type.rent}
                  onChange={handleChange}
                />
                <label htmlFor="rent" className="text-sm text-gray-700">
                  Rent
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sell"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={sidebarData.type.sell}
                  onChange={handleChange}
                />
                <label htmlFor="sell" className="text-sm text-gray-700">
                  Sell
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={sidebarData.type.offer}
                  onChange={handleChange}
                />
                <label htmlFor="offer" className="text-sm text-gray-700">
                  Offer
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={sidebarData.type.parking}
                  onChange={handleChange}
                />
                <label htmlFor="parking" className="text-sm text-gray-700">
                  Parking
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={sidebarData.type.furnished}
                  onChange={handleChange}
                />
                <label htmlFor="furnished" className="text-sm text-gray-700">
                  Furnished
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Sort By:
            </label>
            <select
              id="sort"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Properties"}
          </button>
        </form>
      </div>

      <div className="flex-1 bg-white">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold">Search Results</h1>
          <p className="text-gray-300 mt-2">Find your perfect property below</p>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">⚠️</div>
                <div>{error}</div>
              </div>
            </div>
          )}

          {loading && listings.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Searching for properties...
                </p>
              </div>
            </div>
          ) : listings.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <p className="text-gray-600 text-xl mb-2">No properties found</p>
              <p className="text-gray-500">
                Try adjusting your search criteria to find more results
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-row-1 md:flex-row-2 lg:flex-row-4 gap-6">
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>

              {showMore && (
                <div className="text-center pt-8">
                  <button
                    onClick={handleShowMore}
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More Properties"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;