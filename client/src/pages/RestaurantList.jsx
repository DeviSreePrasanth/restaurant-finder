import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import NavBar from "../components/Navbar";
const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]); 
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const location = useLocation();
  const [loading, setLoading] = useState(true); 

  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  const filteredRestaurants = useMemo(() => {
    if (!searchQuery) return restaurants;
    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, restaurants]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true); 
      try {
        const url = `https://restaurant-production-06c2.up.railway.app/api/restaurants?page=${page}&limit=8`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        let restaurantsData = [];

        for (let i = 0; i < data.restaurants.length; i++) {
          if (data.restaurants[i]?.restaurant) {
            restaurantsData.push(data.restaurants[i].restaurant);
          }
        }

        setRestaurants(restaurantsData);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchRestaurants();
  }, [page]); 

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-500";
    if (rating >= 2) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <>
    <NavBar textBlack={true} />
    <div className="restaurant-list p-5 bg-gray-50 mt-20 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800"><span className="font-serif">Restaurants List</span></h1>

      {/* Loading Indicator */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}

      {/* Restaurant Cards */}
      <div className="restaurant-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {!loading && filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="restaurant-card bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <LazyLoadImage
                src={restaurant.featured_image || restaurant.thumb || "https://via.placeholder.com/150"}
                alt={restaurant.name}
                className="restaurant-image w-full h-48 object-cover"
                height="192"
                width="100%"
              />
              <div className="p-4">
                <h2 className="restaurant-name text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                  {restaurant.name || "Unnamed Restaurant"}
                </h2>
                <p className="restaurant-location text-gray-600">{restaurant.location?.city || "Unknown City"}</p>
                <p className="restaurant-cost text-gray-800 mt-2">
                  Avg Cost for two: <span className="font-bold">Rs. {restaurant.average_cost_for_two || "N/A"}</span>
                </p>
                <p className="restaurant-rating text-gray-600 mt-2">
                  Rating: <span className={`font-semibold ${getRatingColor(restaurant.user_rating?.aggregate_rating)}`}>
                    {restaurant.user_rating?.aggregate_rating || "N/A"}⭐
                  </span>
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
          ))
        ) : (
          !loading && <p className="text-center text-gray-600 col-span-full">No restaurants found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-lg text-gray-700">Page {page} of {totalPages}</span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default RestaurantsList;