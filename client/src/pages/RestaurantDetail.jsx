import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:5000/restaurants/${id}`);
        const data = await response.json();
        console.log("Fetched Restaurant Data:", data);
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
      setLoading(false);
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600 py-8">Loading...</p>;
  if (!restaurant) return <p className="text-center text-red-500 py-8">Restaurant not found.</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Image & Rating Section */}
          <div className="relative">
            <img
              src={restaurant.featured_image || "https://via.placeholder.com/600"}
              alt={restaurant.name}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-lg font-semibold">
              ⭐ {restaurant.user_rating?.aggregate_rating || "N/A"}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{restaurant.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{restaurant.location?.locality || "Location not available"}</p>

            {/* Cuisines */}
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Cuisine:</span> {restaurant.cuisines || "N/A"}
            </p>

            {/* Address */}
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Address:</span> {restaurant.location?.address || "N/A"}
            </p>

            {/* Pricing & Cost */}
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold">Average Cost for Two:</span> ₹{restaurant.average_cost_for_two || "N/A"}
            </p>

            {/* Contact */}
            <p className="text-gray-700 text-lg mb-6">
              <span className="font-semibold">Phone:</span> {restaurant.phone_numbers || "Not available"}
            </p>

            {/* Visit Website Button */}
            {restaurant.url && (
              <a
                href={restaurant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Visit Website
              </a>
            )}
          </div>

          {/* Menu Section */}
          {restaurant.menu_url && (
            <div className="bg-gray-50 p-8 border-t border-gray-200">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">Menu</h2>
              <a
                href={restaurant.menu_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 hover:underline transition duration-300"
              >
                Click here to view menu 🍽
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantDetails;