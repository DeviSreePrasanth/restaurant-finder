import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bg from "../images/bg.jpeg";
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from "react-icons/fa";
import { MdGpsFixed } from "react-icons/md"; // Icon for latitude
import { RiMapPin2Fill } from "react-icons/ri"; // Icon for longitude
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("10"); 
  const [isLocationSearch, setIsLocationSearch] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lat = queryParams.get("lat");
    const lng = queryParams.get("lng");
    const rad = queryParams.get("radius");

    if (lat && lng && rad) {
      setLatitude(lat);
      setLongitude(lng);
      setRadius(rad);
      setIsLocationSearch(true);
    }
  }, [location.search]);

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

  const handleSearchSubmit = () => {
    if (isLocationSearch) {
      if (!latitude.trim() || !longitude.trim()) {
        alert("Please enter latitude and longitude.");
        return;
      }
  
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(longitude);
  
      if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
        alert("Please enter valid latitude (-90 to 90) and longitude (-180 to 180).");
        return;
      }
  
      const searchParams = new URLSearchParams();
      searchParams.append("latitude", latitude);
      searchParams.append("longitude", longitude);
      searchParams.append("radius", radius);
      navigate(`/locationR?${searchParams.toString()}`);
    } else {
      if (!searchQuery.trim()) {
        alert("Please enter a search query.");
        return;
      }
      const searchParams = new URLSearchParams();
      searchParams.append("search", searchQuery);
      navigate(`/restaurants?${searchParams.toString()}`);
    }
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
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <Navbar />
      </div>

      <div className="text-center text-white max-w-4xl w-full px-4 mt-32">
        <h1 className="text-5xl font-bold mb-6 animate-fade-in">
          Welcome to Restaurant Finder
        </h1>
        <p className="text-xl mb-8 animate-fade-in delay-100">
          Discover the best restaurants, search by cuisine, city, or name, and explore detailed restaurant information.
        </p>

        <div className="bg-transparent rounded-lg shadow-2xl p-6 max-w-2xl mx-auto animate-fade-in delay-200">
          <div className="flex items-center bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg overflow-hidden">
            {!isLocationSearch ? (
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisines..."
                className="flex-grow py-3 px-4 text-black bg-transparent focus:outline-none placeholder-gray-700 focus:placeholder-gray-600 transition-all duration-300"
                aria-label="Search restaurants"
                required
              />
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 flex-grow">
                {/* Latitude Input */}
                <div className="relative flex-grow">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <MdGpsFixed size={20} />
                  </div>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Enter Latitude"
                    className="py-3 pl-10 pr-4 text-black bg-transparent focus:outline-none placeholder-gray-700 focus:placeholder-gray-600 w-full transition-all duration-300 border border-white border-opacity-30 rounded-lg"
                    aria-label="Latitude"
                    required
                  />
                </div>

                {/* Longitude Input */}
                <div className="relative flex-grow">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <RiMapPin2Fill size={20} />
                  </div>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Enter Longitude"
                    className="py-3 pl-10 pr-4 text-black bg-transparent focus:outline-none placeholder-gray-700 focus:placeholder-gray-600 w-full transition-all duration-300 border border-white border-opacity-30 rounded-lg"
                    aria-label="Longitude"
                    required
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setIsLocationSearch(!isLocationSearch)}
              className="p-3 text-gray-700 hover:text-blue-400 transition duration-200"
              aria-label="Toggle location search"
            >
              {isLocationSearch ? <FaSearch size={20} /> : <FaMapMarkerAlt size={20} />}
            </button>
          </div>

          {isLocationSearch && (
            <button
              onClick={fetchUserLocation}
              className="mt-3 flex items-center justify-center w-full bg-green-600 bg-opacity-90 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
              aria-label="Use my location"
            >
              {loadingLocation ? (
                "Fetching location..."
              ) : (
                <>
                  <FaLocationArrow className="mr-2" /> Use My Location
                </>
              )}
            </button>
          )}

          <button
            onClick={handleSearchSubmit}
            className="mt-6 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
            aria-label="Search Restaurants"
          >
            Search Restaurants
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
