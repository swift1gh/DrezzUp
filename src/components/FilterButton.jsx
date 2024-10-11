import React from "react";

const FilterButton = ({ Name, isActive, onClick }) => {
  return (
    <button
      className={`px-2 md:px-3 py-1 shadow-lg hover:scale-105 border border-[#B9B9B9] text-sm md:text-base rounded-xl ${
        isActive ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={onClick}>
      {Name}
    </button>
  );
};

export default FilterButton;
