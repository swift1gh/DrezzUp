import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { motion } from "motion/react";

const Navbar = ({
  Btn,
  Destination,
  onClick,
  searchTerm,
  setSearchTerm,
  isHome = false,
}) => {
  return (
    <div
      className="bg-[#FBF4F4] shadow-md sticky top-0 w-full z-50"
      id="navbar">
      <div className="flex flex-row justify-between items-center px-5 py-3 md:px-14 gap-3">
        <h1
          id="logo"
          className="font-sans font-semibold text-[22px] md:text-[28px] cursor-default">
          <span className="text-white bg-black px-1 py-0.5 rounded-sm">
            DREZZ
          </span>
          <span className="text-[#BD815A] font-bold">UP</span>
        </h1>

        {/* Search bar */}
        {isHome && (
          <motion.div
            initial={false}
            animate={{ scale: 1 }}
            className="hidden md:block pl-[2rem] flex-grow max-w-xl">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </motion.div>
        )}

        <div
          id="calculate-btn"
          className="flex justify-center items-center gap-5 cursor-pointer">
          <Link to={Destination}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#BD815A] p-2 px-4 md:p-3 border rounded-[18px] border-gray-500 cursor-pointer shadow-md hover:bg-[#c78b6a] transition-colors duration-200">
              <span className="text-white font-medium cursor-pointer">
                {Btn}
              </span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
