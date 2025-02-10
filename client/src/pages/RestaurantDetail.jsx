import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`https://restaurant-finder-0in9.onrender.com/restaurants/${id}`);
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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!restaurant) return <p className="text-center text-red-500">Restaurant not found.</p>;

  return (
    <>
    <div className="mt-10 p-8 bg-beige shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <img
            src={restaurant.featured_image || "https://via.placeholder.com/600"}
            alt={restaurant.name}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          <div 
            className="absolute top-4 left-4 px-4 py-2 rounded-lg text-lg font-semibold text-white"
            style={{ backgroundColor: `#${restaurant.user_rating?.rating_color || "000"}` }}
          >
            ⭐ {restaurant.user_rating?.aggregate_rating || "N/A"}
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-biscuit-900">{restaurant.name}</h1>
          <p className="text-buscuit-600 text-lg mt-2">{restaurant.location?.locality || "Location not available"}</p>
          <p className="mt-4 text-white-200 text-lg"><b>Cuisine:</b> {restaurant.cuisines || "N/A"}</p>
          <p className="mt-2"><b>Address:</b> {restaurant.location?.address || "N/A"}</p>
          <p className="mt-2"><b>City:</b> {restaurant.location?.city || "N/A"}</p>
          <p className="mt-2"><b>Latitude:</b> {restaurant.location?.latitude || "N/A"}, <b>Longitude:</b> {restaurant.location?.longitude || "N/A"}</p>
          <p className="mt-2"><b>Average Cost for Two:</b> ₹{restaurant.average_cost_for_two || "N/A"}</p>
          {restaurant.url && (
            <a
              href={restaurant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-between w-60 bg-beige-600 text-black px-6 py-3 rounded-lg hover:bg-black-700 transition text-center shadow-md border border-gray-600"
            >
              <span>Visit Website</span>
              <FaArrowRight />
            </a>
          )}
        </div>
      </div>

      {restaurant.zomato_events && restaurant.zomato_events.length > 0 && (
        <div className="mt-10 p-6 bg-beige-100 rounded-lg">
          <h2 className="text-3xl font-semibold text-buscuit-1000 mb-4">Events</h2>
          {restaurant.zomato_events.map((eventObj, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{eventObj.event.title}</h3>
              <p><b>Date:</b> {eventObj.event.display_date}</p>
              <p><b>Time:</b> {eventObj.event.display_time}</p>
              <p><b>Description:</b> {eventObj.event.description}</p>
              <p><b>Share URL:</b> <a href={eventObj.event.share_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{eventObj.event.share_url || "N/A"}</a></p>
              <div className="flex space-x-4 mt-2">
                {eventObj.event.photos.map((photo, i) => (
                  <img key={i} src={photo.photo.url} alt="Event" className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default RestaurantDetails;
