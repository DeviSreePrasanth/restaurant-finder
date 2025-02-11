import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import NavBar from "../components/Navbar";
import { motion } from "framer-motion";

const NameSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchName = queryParams.get("name"); // Extract search query

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchName) {
      setError("No restaurant name provided.");
      return;
    }

    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://restaurant-finder-0in9.onrender.com/namesearch?name=${encodeURIComponent(searchName)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Failed to fetch restaurants.");
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, [searchName]);

  return (
    <div className="location-page bg-gray-50 min-h-screen">
      <NavBar />
      <div className="p-5">
        <motion.h1
          className="text-2xl font-bold mt-20 mb-6 text-center text-black-600"
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
                      {restaurant?.aggregate_rating || "N/A"}⭐
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

export default NameSearch;
