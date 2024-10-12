import React from "react";
import FilterButton from "./FilterButton";

const Filter = ({ selectedBrand, setSelectedBrand }) => {
  const brands = [
    "All",
    "Air Jordan",
    "Nike",
    "Timberland",
    "Vans",
    "Amiri",
    "Adidas",
  ];

  return (
    <nav className="p-3 bg-[#ffffff00] flex justify-center items-center sticky top-20 w-full z-50">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide p-3 scroll-smooth">
        {brands.map((brand) => (
          <FilterButton
            key={brand}
            Name={brand}
            isActive={selectedBrand === brand}
            onClick={() => setSelectedBrand(brand)}
          />
        ))}
      </div>
    </nav>
  );
};

export default Filter;
