import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate listing data
        if (!listing || !listing.userRef) {
          throw new Error("Invalid listing data - missing userRef");
        }

        // Try different possible API endpoints
        const possibleEndpoints = [
          `/api/users/${listing.userRef}`,
          `/api/user/${listing.userRef}`,
          `/api/landlord/${listing.userRef}`,
          `/api/users/get/${listing.userRef}`,
        ];

        let landlordData = null;
        let lastError = null;

        for (const endpoint of possibleEndpoints) {
          try {
            const res = await fetch(endpoint);

            // Check if response is ok
            if (!res.ok) {
              lastError = `HTTP ${res.status}: ${res.statusText}`;
              continue;
            }

            // Check content type
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              lastError = "Server returned non-JSON response";
              continue;
            }

            const data = await res.json();

            // Check if data is valid
            if (data && (data.username || data.email)) {
              landlordData = data;
              break;
            } else if (data.success === false) {
              lastError = data.message || "User not found";
              continue;
            }
          } catch (fetchError) {
            lastError = fetchError.message;
            continue;
          }
        }

        if (!landlordData) {
          throw new Error(lastError || "Unable to fetch landlord information");
        }

        setLandlord(landlordData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching landlord:", error);

        // Provide user-friendly error messages
        let errorMessage = error.message;
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to server. Please check your internet connection.";
        } else if (error.message.includes("NetworkError")) {
          errorMessage = "Network error. Please try again later.";
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // Initialize message with default text
  useEffect(() => {
    if (landlord && listing) {
      setMessage(
        `Hello ${landlord.username}, I am interested in ${listing.name}. Please contact me.`
      );
    }
  }, [landlord, listing]);

  // Don't render if no listing
  if (!listing) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: No listing data provided</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Contact Landlord
      </h2>

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">
            Loading contact information...
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          <div className="mt-2 text-sm">
            <p>Possible solutions:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Refresh the page and try again</li>
              <li>Check if you're logged in</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      )}

      {landlord && !loading && !error && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-3 rounded-md">
            <p className="text-green-800">
              <strong>Contact:</strong> {landlord.username}
            </p>
            {landlord.email && (
              <p className="text-green-700 text-sm">
                <strong>Email:</strong> {landlord.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Message
            </label>
            <textarea
              name="message"
              id="message"
              rows="4"
              value={message}
              onChange={onChange}
              placeholder={`Hello ${landlord.username}, I am interested in ${listing.name}. Please contact me.`}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {landlord.email ? (
            <Link
              to={`mailto:${landlord.email}?subject=Regarding ${
                listing.name
              }&body=${encodeURIComponent(message)}`}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block text-center"
            >
              Send Email
            </Link>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>
                Email address not available. Please contact through other means.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Contact;
