import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaBars, FaTimes } from 'react-icons/fa';

const NavbarLP = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-blue-100 shadow-md sticky top-0 z-50 -mt-10 mb-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

        {/* Logo / Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <FaUtensils className="text-blue-600 text-2xl" />
          <span className="text-lg font-bold text-blue-700 tracking-wide">Nexora</span>
        </Link>

        {/* Hamburger button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <FaTimes className="text-blue-700 text-2xl" /> : <FaBars className="text-blue-700 text-2xl" />}
          </button>
        </div>

        {/* Nav links */}
        <ul className={`md:flex md:items-center space-x-6 text-blue-800 font-medium ${isOpen ? 'block mt-4 md:mt-0' : 'hidden md:flex'}`}>
          <li>
            <Link to="/learninghome" className="hover:text-blue-600 transition duration-200">Home</Link>
          </li>
          <li>
            <Link to="/plan/beginner" className="hover:text-blue-600 transition duration-200">Explore</Link>
          </li>
          <li>
            <Link to="/learning-plan" className="hover:text-blue-600 transition duration-200">My Plan</Link>
          </li>
          <li>
            <Link to="/progress" className="hover:text-blue-600 transition duration-200">My Progress</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarLP;
