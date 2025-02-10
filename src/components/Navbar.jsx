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
    <div className="bg-[#FBF4F4] shadow-md sticky top-0 w-full z-50">
      <div className="flex flex-row justify-between items-center px-5 py-2 md:px-14 pt-5 gap-3">
        <h1 className="font-sans font-semibold text-[20px] md:text-[25px] cursor-default">
          <span className="text-white bg-black">DREZZ</span>
          UP
        </h1>

        {/* Search bar */}
        {isHome && (
          <div className="hidden md:block pl-[2rem]">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        )}

        <div className="flex justify-center items-center gap-5 cursor-pointer">
          <Link to={Destination}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => console.log("hover started!")}
              onClick={onClick}
              className="bg-[#BD815A] p-2 px-3 md:p-3 border rounded-[18px] border-[#00000089] cursor-pointer">
              <span className="text-white cursor-pointer">{Btn}</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
