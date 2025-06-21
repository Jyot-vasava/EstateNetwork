import React from "react";
import { useNavigate, Link } from "react-router-dom";

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-5"
      >
        <input
          type="text"
          placeholder="Username"
          className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg uppercase font-semibold hover:opacity-65 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-6 text-gray-600">
        <p>Have an account?</p>
        <Link to="/signin">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Sign In
          </span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};

export default SignUp;
