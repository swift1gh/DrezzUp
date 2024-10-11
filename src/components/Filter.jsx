import React, { useState } from "react";
import FilterButton from "./FilterButton";

const Filter = ({ selectedBrand, setSelectedBrand }) => {
  const brands = ["All", "Air Jordan", "Nike", "Vans", "Amiri", "Adidas"];

  return (
    <nav className="py-3 bg-[#ffffff00] sticky justify-center flex items-center top-20 w-full z-50">
      <div className="flex gap-2 drop-shadow-lg pb-4">
        {brands.map((brand) => (
          <FilterButton
            key={brand}
            Name={brand}
            isActive={selectedBrand === brand}
            onClick={() => setSelectedBrand(brand)} // Set selected brand when clicked
          />
        ))}
      </div>
    </nav>
  );
};

export default Filter;
