import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/search");
    }
  };

  // Handle search input focus - redirect to search page
  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/search");
    }
  };

  // Handle search icon click
  const handleSearchIconClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/search");
    }
  };

  // Update search term from URL when on search page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl && window.location.pathname === "/search") {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Estate</span>
            <span className="text-slate-700">Network</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSearchSubmit}
          className="bg-slate-100 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-24 sm:w-64 px-3 py-2"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          <button
            type="submit"
            className="p-2 hover:bg-slate-200 rounded-r-lg transition-colors"
          >
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-3">
          {user ? (
            <Link to="/profile">
              <img
                src={
                  user.profilePicture ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                }
                alt="profile-image"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 hover:border-blue-500 transition-colors"
              />
            </Link>
          ) : (
            <Link to="/signin">
              <li className="text-slate-700 hover:underline cursor-pointer">
                Sign In
              </li>
            </Link>
          )}

          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              About
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
