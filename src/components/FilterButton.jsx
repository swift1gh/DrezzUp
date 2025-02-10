import React from "react";
import { motion } from "motion/react";

const FilterButton = ({ Name, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => console.log("hover started!")}
      className={`px-2 md:px-3 py-1 whitespace-nowrap shadow-lg border border-[#B9B9B9] text-sm md:text-base rounded-xl ${
        isActive ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={onClick}>
      {Name}
    </motion.button>
  );
};

export default FilterButton;
