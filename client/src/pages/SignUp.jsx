import React from "react";
import { useNavigate, Link } from "react-router-dom";
import RAuth from "../components/RAuth";
import config from "../../config";

const SignUp = () => {
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.id]: e.target.value };
    setFormData(updatedFormData);
    console.log(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch(
        `https://estate-network-backend-api.onrender.com/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      //console.log("User signed up successfully:", data);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Join Us Today
            </h1>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                id="username"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                id="password"
                onChange={handleChange}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <RAuth />
          </form>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <p>Already have an account?</p>
              <Link to="/signin">
                <span className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200">
                  Sign In
                </span>
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">⚠️</div>
                <div>Error: {error}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
