import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUtensils } from "react-icons/fa"; // React Icons for Home and Restaurants
import img from "../images/Food.png";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img src={img} alt="Restaurant Finder Logo" className="h-12 w-auto mr-4" />
          <h1 className="text-2xl font-semibold font-poppins">Restaurant Finder</h1>
        </div>

        {/* Menu with Icons */}
        <ul className="flex space-x-6 ml-auto">
          <li>
            <Link to="/" className="flex items-center hover:text-gray-400 font-medium transition duration-300">
              <FaHome size={24} />
            </Link>
          </li>
          <li>
            <Link to="/restaurants" className="flex items-center hover:text-gray-400 font-medium transition duration-300">
              <FaUtensils size={24} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
