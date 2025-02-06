import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LocationPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // For redirection

  const lat = searchParams.get("latitude");
  const lng = searchParams.get("longitude");
  const radius = searchParams.get("radius");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        if (!lat || !lng || !radius || isNaN(lat) || isNaN(lng) || isNaN(radius)) {
          alert("Enter valid latitude, longitude, and radius.");
          navigate("/"); // Redirect to home page
          return;
        }

        const apiUrl = `https://dsp-1.onrender.com/locationR?lat=${lat}&lng=${lng}&radius=${radius}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          alert("No restaurants found in that location.");
          navigate("/"); // Redirect to home page
          return;
        }

        setRestaurants(data.map(item => item.restaurant));
      } catch (error) {
        alert(`Error: ${error.message}`);
        navigate("/"); // Redirect to home page
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [lat, lng, radius, navigate]);

  return (
    <div className="location-page bg-gray-50 min-h-screen">
      <Navbar />
      <div className="p-5">
        <motion.h1
          className="text-2xl font-bold mb-6 text-center text-black-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nearby Restaurants
        </motion.h1>

        {loading ? (
          <motion.div
            className="text-center text-xl text-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={index}
                className="restaurant-card bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {restaurant.featured_image ? (
                  <LazyLoadImage
                    src={restaurant.featured_image}
                    alt={restaurant.name}
                    className="restaurant-image w-full h-48 object-cover"
                    height="192"
                    width="100%"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex justify-center items-center text-gray-600">
                    No Image Available
                  </div>
                )}

                <div className="p-4">
                  <h3 className="restaurant-name text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    {restaurant.name || "No name available"}
                  </h3>
                  <p className="restaurant-location text-gray-600">
                    {restaurant.location?.city || "Location not available"}
                  </p>
                  <p className="restaurant-cost text-gray-800 mt-2">
                    Average Cost for Two:{" "}
                    <span className="font-bold">
                      Rs. {restaurant.average_cost_for_two || "N/A"}
                    </span>
                  </p>
                  <p className="restaurant-rating text-gray-600 mt-2">
                    Rating:{" "}
                    <span className="font-semibold text-green-600">
                      {restaurant.user_rating?.aggregate_rating || "N/A"}⭐
                    </span>
                  </p>
                  <div className="flex justify-between items-center p-4 bg-gray-50">
                    <Link
                      to={`/restaurant/${restaurant.id}`}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
