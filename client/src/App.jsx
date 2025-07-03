import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import CreateListing from "./pages/createlisting";
import Header from "./components/Header";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";







function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/listings/:listingId" element={<Listing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:id" element={<UpdateListing />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;


