import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import bg from "../images/bg.jpeg";
import { FaMapMarkerAlt, FaSearch, FaCamera } from "react-icons/fa";
import Navbar from "../components/Navbar";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("10"); // New radius state
  const [imageFile, setImageFile] = useState(null);
  const [searchMode, setSearchMode] = useState("name");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  // Fetch User's Location Automatically
  const fetchUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to get location. Please enter manually.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handle Search Submission
  const handleSearchSubmit = async () => {
    if (searchMode === "location") {
      if (!latitude.trim() || !longitude.trim() || !radius.trim()) {
        alert("Please enter latitude, longitude, and radius.");
        return;
      }
      navigate(`/locationR?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
    } else if (searchMode === "image") {
      if (!imageFile) {
        alert("Please upload an image.");
        return;
      }
  
      // Create FormData
      const formData = new FormData();
      formData.append("image", imageFile);
  
      // Navigate to /imagesearch with formData (handle fetching in that component)
      navigate("/image-search", { state: { imageFile } });
    } else {
      if (!searchQuery.trim()) {
        alert("Please enter the name of the restaurant.");
        return;
      }
      navigate(`/restaurants?search=${searchQuery}`);
    }
  };
  
  

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <Navbar />
      </div>

      <motion.div className="text-center text-white max-w-4xl w-full px-4 mt-32" initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="text-4xl font-bold mb-6">Search Restaurants</h1>

        {/* Search Mode Buttons */}
        <motion.div className="flex justify-center gap-4 mb-6">
          {["name", "location", "image"].map((mode, index) => (
            <button
              key={index}
              onClick={() => setSearchMode(mode)}
              className={`py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
                searchMode === mode
                  ? "bg-gradient-to-r from-blue-500 to-purple-600"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
              }`}
            >
              {mode === "name" && "Search by Name"}
              {mode === "location" && "Search by Location"}
              {mode === "image" && "Search by Image"}
            </button>
          ))}
        </motion.div>

        {/* Search Inputs */}
        <motion.div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl p-6 max-w-2xl mx-auto border border-white/10" variants={fadeIn}>
          <AnimatePresence mode="wait">
            {searchMode === "name" && (
              <motion.div key="name">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter restaurant name..."
                  className="w-full py-3 px-4 text-black bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent transition-all duration-300 placeholder:text-gray-500"
                />
              </motion.div>
            )}

            {searchMode === "location" && (
              <motion.div key="location" className="flex flex-col gap-4">
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Enter Latitude"
                  className="w-full py-3 px-4 text-black bg-white/90 rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Enter Longitude"
                  className="w-full py-3 px-4 text-black bg-white/90 rounded-lg focus:outline-none"
                />
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  placeholder="Enter Radius (in km)"
                  className="w-full py-3 px-4 text-black bg-white/90 rounded-lg focus:outline-none"
                />
                <button onClick={fetchUserLocation} className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg">
                  {loadingLocation ? "Fetching Location..." : " Search Nearby Restaurants"}
                </button>
              </motion.div>
            )}

            {searchMode === "image" && (
              <motion.div key="image">
                <label className="w-full flex flex-col items-center bg-white/90 text-gray-700 py-3 px-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                  <FaCamera className="text-2xl mb-2 text-blue-600" />
                  {imageFile ? <span>{imageFile.name}</span> : <span>Upload Image</span>}
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleSearchSubmit} className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
            Search
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Search;
