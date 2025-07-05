import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/listingitem";

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

      const res = await fetch(`/api/listing/get?${searchQuery}`);

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
        const res = await fetch(`/api/listing/get?${searchQuery}`);

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
      const res = await fetch(`/api/listing/get?${searchQuery}`);

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
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {loading && listings.length === 0 ? (
            <p className="text-slate-600">Searching...</p>
          ) : listings.length === 0 && !loading ? (
            <p className="text-slate-600">
              No listings found. Try adjusting your search criteria.
            </p>
          ) : (
            <>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
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
