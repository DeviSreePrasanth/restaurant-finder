import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom'; 
import { LazyLoadImage } from 'react-lazy-load-image-component';  

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [restaurantsPerPage] = useState(8);

  // Get search query parameter from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetch(`https://restaurant-finder-0in9.onrender.com/restaurants?page=${currentPage}&limit=${restaurantsPerPage}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        let restaurantsData = [];

        // Loop through the data array to get restaurant details from all pages
        for (let i = 0; i < data.length; i++) {
          const pageRestaurants = data[i]?.restaurants
            ? data[i].restaurants.map(item => item.restaurant)
            : [];

          restaurantsData = [...restaurantsData, ...pageRestaurants];
        }

        let filteredRestaurants = restaurantsData;
        if (searchQuery) {
          filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setRestaurants(filteredRestaurants);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [searchQuery]);

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  const totalPages = Math.ceil(restaurants.length / restaurantsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Navbar />
      <div className="restaurant-list p-5 bg-gray-50 min-h-screen">
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          currentRestaurants.length > 0 ? (
            <div>
              <div className="restaurant-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentRestaurants.map((restaurant, index) => {
                  const {
                    name,
                    location,
                    average_cost_for_two,
                    user_rating,
                    featured_image,
                  } = restaurant;

                  return (
                    <div key={index} className="restaurant-card bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                      <LazyLoadImage
                        src={featured_image}
                        alt={name}
                        className="restaurant-image w-full h-48 object-cover"
                        height="192" // You can specify a fixed height
                        width="100%" // Ensures that it takes full width
                        // No blur effect here, just lazy loading the image
                      />
                      <div className="p-4">
                        <h3 className="restaurant-name text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">{name}</h3>
                        <p className="restaurant-location text-gray-600">{location.city}</p>
                        <p className="restaurant-cost text-gray-800 mt-2">
                          Average Cost for Two: <span className="font-bold">Rs. {average_cost_for_two}</span>
                        </p>
                        <p className="restaurant-rating text-gray-600 mt-2">
                          Rating: <span className="font-semibold text-green-600">{user_rating.aggregate_rating}⭐</span>
                        </p>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50">
                        <Link
                          to={`/restaurant/${restaurant.id}`}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pagination flex justify-center items-center gap-4 mt-6">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-lg text-gray-700">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No restaurants found</p>
          )
        )}
      </div>
    </>
  );
};

export default RestaurantList;