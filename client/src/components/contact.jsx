import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Contact component rendered with listing:", listing);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        console.log("Fetching landlord for userRef:", listing.userRef);
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/users/${listing.userRef}`);
        console.log("Response status:", res.status);
        console.log("Response headers:", res.headers.get("content-type"));

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Server returned non-JSON response. Check if backend is running."
          );
        }

        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok) {
          throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        setLandlord(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching landlord:", error);

        // More specific error messages
        let errorMessage = error.message;
        if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to server. Please check if the backend is running.";
        } else if (error.message.includes("Unexpected token")) {
          errorMessage =
            "Server configuration error. Check your proxy settings.";
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    if (listing && listing.userRef) {
      fetchLandlord();
    } else {
      console.error("No listing or userRef provided");
      setError("Invalid listing data");
      setLoading(false);
    }
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  // Debug render
  console.log("Current state:", { landlord, loading, error });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Contact Form
      </h2>

      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">
            Loading landlord information...
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          <div className="mt-2 text-sm">
            <p>Troubleshooting steps:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Check if your backend server is running</li>
              <li>Verify the API endpoint exists</li>
              <li>Check your proxy configuration</li>
            </ul>
          </div>
        </div>
      )}

      {!loading && !error && !landlord && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <strong>Warning:</strong> No landlord information found.
        </div>
      )}

      {landlord && !loading && !error && (
        <div className="space-y-4">
          <p className="text-lg font-medium text-gray-800">
            Contact {landlord.username} for{" "}
            <span className="font-normal">{listing.name?.toLowerCase()}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="4"
            value={message}
            onChange={onChange}
            placeholder={`Hello ${landlord.username}, I am interested in ${listing.name}. Please contact me.`}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block text-center"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;
