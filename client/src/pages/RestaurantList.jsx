import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const restaurantsPerPage = 8;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const radius = searchParams.get("radius");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const storedRestaurants = JSON.parse(localStorage.getItem("restaurants"));
    if (storedRestaurants && !searchQuery) {
      setRestaurants(storedRestaurants);
      setLoading(false);
    } else {
      fetchRestaurants();
    }
  }, [latitude, longitude, radius, searchQuery]);

  const fetchRestaurants = () => {
    let apiUrl = "https://dsp-1.onrender.com/restaurants";
    setLoading(true);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        let restaurantsData = data.flatMap((page) =>
          page.restaurants?.map((item) => item.restaurant) || []
        );

        if (searchQuery) {
          restaurantsData = restaurantsData.filter((restaurant) =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setRestaurants(restaurantsData);
        localStorage.setItem("restaurants", JSON.stringify(restaurantsData));
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    localStorage.setItem("currentPage", newPage);
  };

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const totalPages = Math.ceil(restaurants.length / restaurantsPerPage);

  return (
    <>
      <Navbar />
      <div className="restaurant-list p-5 bg-gray-100 min-h-screen">
        {loading ? (
          <p className="text-center text-gray-600 text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">Error: {error}</p>
        ) : currentRestaurants.length > 0 ? (
          <div>
            <div className="restaurant-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentRestaurants.map((restaurant, index) => (
                <div key={index} className="restaurant-card bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <LazyLoadImage
                    src={restaurant.featured_image}
                    alt={restaurant.name}
                    className="restaurant-image w-full h-48 object-cover"
                    height="192"
                    width="100%"
                    placeholderSrc="https://via.placeholder.com/300"
                  />
                  <div className="p-4">
                    <h3 className="restaurant-name text-2xl font-bold text-gray-800 hover:text-blue-500 transition-colors duration-300">
                      {restaurant.name}
                    </h3>
                    <p className="restaurant-location text-gray-600 mt-2">{restaurant.location.city}</p>
                    <p className="restaurant-cost text-gray-800 mt-2">
                      Avg. Cost for Two: <span className="font-semibold">Rs. {restaurant.average_cost_for_two}</span>
                    </p>
                    <p className="restaurant-rating text-gray-600 mt-2">
                      Rating: <span className="font-semibold text-green-600">{restaurant.user_rating.aggregate_rating}⭐</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50">
                    <Link to={`/restaurant/${restaurant.id}`} className="text-blue-500 hover:text-blue-700 transition-colors duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-lg text-gray-700">Page {currentPage}</span>
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">No restaurants found</p>
        )}
      </div>
    </>
  );
};

export default RestaurantList;
