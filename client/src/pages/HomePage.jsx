import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bg from "../images/bg.jpeg";
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from "react-icons/fa";
import Navbar from "../components/Navbar";

// CSS for animation (in the same file)
const styles = {
  animationWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
    minHeight: "100vh",
  },
  textWrapper: {
    textAlign: "center",
    color: "white",
    maxWidth: "4xl",
    width: "100%",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    marginTop: "8rem",
  },
  animationKeyframes: `
    @keyframes slideIn {
      0% {
        transform: translateX(-100%);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  h1: {
    textAlign: "center",
    color: "white",
    fontSize: "3rem",
    marginBottom: "1.5rem",
    animation: "slideIn 1.5s forwards",
  },
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("10"); // Default radius is 10 km
  const [isLocationSearch, setIsLocationSearch] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Used to get the current URL parameters

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
    const searchParams = new URLSearchParams();

    if (isLocationSearch) {
      if (latitude && longitude) {
        searchParams.append("latitude", latitude);
        searchParams.append("longitude", longitude);
        searchParams.append("radius", radius);
      }
      navigate(`/locationR?${searchParams.toString()}`);
    } else {
      if (searchQuery) {
        searchParams.append("search", searchQuery);
      }
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
        height: "100vh", // Ensure no scrolling
        overflow: "hidden", // Prevent scrolling
      }}
    >
      {/* Navbar */}
      <div style={styles.animationWrapper}>
        <Navbar />
      </div>

      {/* Main content */}
      <div style={styles.container}>
        {/* Injecting animation keyframes */}
        <style>{styles.animationKeyframes}</style>

        {/* Welcome Message with Slide-in effect for h1 */}
        <div style={styles.textWrapper}>
          <h1 style={styles.h1}>Welcome to Restaurant Finder</h1>
          <p className="text-xl mb-8">
            Discover the best restaurants, search by cuisine, city, or name, and explore detailed restaurant information.
          </p>

          {/* Search Box */}
          <div className="bg-transparent rounded-lg shadow-2xl p-6 max-w-2xl mx-auto">
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
                <div className="flex gap-4 flex-grow">
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Enter Latitude"
                    className="py-3 px-4 text-black bg-transparent focus:outline-none placeholder-gray-700 focus:placeholder-gray-600 w-full transition-all duration-300"
                    aria-label="Latitude"
                    required
                  />
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Enter Longitude"
                    className="py-3 px-4 text-black bg-transparent focus:outline-none placeholder-gray-700 focus:placeholder-gray-600 w-full transition-all duration-300"
                    aria-label="Longitude"
                    required
                  />
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

            {/* Location Button */}
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

            {/* Search Button */}
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
    </div>
  );
};

export default HomePage;
