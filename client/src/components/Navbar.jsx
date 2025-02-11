import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUtensils,FaSearch } from "react-icons/fa"; // Icons for Home & Restaurants
import img from "../images/Food.png";

const Navbar = ({ textWhite }) => {
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/10 shadow-lg border border-white/20 p-4 ${textWhite ? 'text-white' : 'text-black'}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <img src={img} alt="Restaurant Finder Logo" className="h-12 w-auto mr-4 rounded-lg" />
          <h1 className="text-2xl font-semibold font-poppins tracking-wide">Restaurant Finder</h1>
        </div>

        {/* Menu with Icons */}
        <ul className="flex space-x-6 ml-auto">
          <li className="flex items-center">
            <Link to="/" className={`flex items-center hover:opacity-80 transition duration-300 ${textWhite ? 'text-white' : 'text-black'}`}>
              <FaHome size={24} />
              <h1 className="ml-2 hidden sm:inline">Home</h1> {/* Hidden on small screens */}
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/restaurants" className={`flex items-center hover:opacity-80 transition duration-300 ${textWhite ? 'text-white' : 'text-black'}`}>
              <FaUtensils size={24} />
              <h1 className="ml-2 hidden sm:inline">Restaurants</h1> {/* Hidden on small screens */}
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/search" className={`flex items-center hover:opacity-80 transition duration-300 ${textWhite ? 'text-white' : 'text-black'}`}>
              <FaSearch size={24} />
              <h1 className="ml-2 hidden sm:inline">Search</h1> {/* Hidden on small screens */}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
