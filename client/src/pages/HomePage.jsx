import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../images/bg.webp";
import NavBar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();

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
      <NavBar textWhite={true} />
      </div>
      <div className="text-center text-white max-w-4xl w-full px-4 mt-32">
        <h1 className="text-5xl font-bold mb-6">Welcome to Restaurant Finder</h1>
        <p className="text-xl mb-8">
          Discover the best restaurants, search by cuisine, city, or name, and explore detailed restaurant information.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => navigate("/restaurants")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition duration-300"
          >
            View All Restaurants
          </button>
          <button
            onClick={() => navigate("/search")}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition duration-300"
          >
            Search Restaurants
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
