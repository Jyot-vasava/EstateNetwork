import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/listingitem";
import {
  FaSearch,
  FaHome,
  FaKey,
  FaUsers,
  FaChartLine,
  FaHandshake,
  FaMapMarkedAlt,
  FaQuoteLeft,
  FaPlay,
} from "react-icons/fa";

import config from "../../config";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);

        // Fetch offer listings
        const offerRes = await fetch(
          `${config.BACKEND_API}/api/listing/get?offer=true&limit=4`
        );
        const offerData = await offerRes.json();
        setOfferListings(offerData);

        // Fetch rent listings
        const rentRes = await fetch(
          "https://estate-network-backend-api.onrender.com/api/listing/get?rent=true&limit=4"
        );
        const rentData = await rentRes.json();
        setRentListings(rentData);

        // Fetch sale listings
        const saleRes = await fetch(
          "https://estate-network-backend-api.onrender.com/api/listing/get?sell=true&limit=4"
        );
        const saleData = await saleRes.json();
        setSaleListings(saleData);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const stats = [
    { icon: FaHome, number: "10K+", label: "Properties Listed" },
    { icon: FaUsers, number: "5K+", label: "Happy Clients" },
    { icon: FaHandshake, number: "8K+", label: "Successful Deals" },
    { icon: FaChartLine, number: "15+", label: "Years Experience" },
  ];

  const features = [
    {
      icon: FaSearch,
      title: "Advanced Search",
      description:
        "Find your perfect property with our powerful search filters",
    },
    {
      icon: FaMapMarkedAlt,
      title: "Prime Locations",
      description: "Properties in the most desirable neighborhoods and areas",
    },
    {
      icon: FaKey,
      title: "Easy Process",
      description:
        "Streamlined buying and renting process from start to finish",
    },
    {
      icon: FaHandshake,
      title: "Expert Support",
      description: "Professional real estate agents to guide you every step",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Home Buyer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "Amazing experience! Found my dream home in just 2 weeks. The team was professional and supportive throughout.",
    },
    {
      name: "Michael Chen",
      role: "Property Investor",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "Excellent platform for investment properties. Great selection and transparent pricing. Highly recommended!",
    },
    {
      name: "Emily Rodriguez",
      role: "First-time Buyer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "As a first-time buyer, I was nervous, but the team made everything so easy. Thank you for the amazing service!",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Find Your
                <span className="block text-transparent bg-clip-text bg-yellow-700">
                  Dream Home
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Discover the perfect property with our extensive collection of
                homes, apartments, and commercial spaces in prime locations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/search"
                className="group inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaSearch className="mr-2 group-hover:rotate-12 transition-transform" />
                Start Your Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to find, buy, or rent your perfect
              property with confidence and ease.
            </p>
          </div>

          <div className="flex flex-row md:flex-row-2 lg:flex-row-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center  p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Listings */}
      {offerListings && offerListings.length > 0 && (
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🔥 Special Offers
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Don't miss out on these incredible deals and discounted
                properties
              </p>
              <Link
                to="/search?offer=true"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors duration-300"
              >
                View All Offers
              </Link>
            </div>

            <div className="flex flex-row md:flex-row-2 lg:flex-row-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rent Listings */}
      {rentListings && rentListings.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🏠 Places for Rent
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Find your perfect rental property in prime locations
              </p>
              <Link
                to="/search?rent=true"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-300"
              >
                View All Rentals
              </Link>
            </div>

            <div className="flex flex-row md:flex-row-2 lg:flex-row-4 gap-6">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Listings */}
      {saleListings && saleListings.length > 0 && (
        <section className="py-20 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                🏡 Properties for Sale
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Discover amazing properties available for purchase
              </p>
              <Link
                to="/search?sell=true"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
              >
                View All Properties
              </Link>
            </div>

            <div className="flex flex-row md:flex-row-2 lg:flex-row-4 gap-6">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream homes
            through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              <FaSearch className="mr-2" />
              Start Searching
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-300"
            >
              <FaUsers className="mr-2" />
              Join Us Today
            </Link>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing properties...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
