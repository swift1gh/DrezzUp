import React from "react";
import FilterButton from "./FilterButton";

const Filter = ({ selectedBrand, setSelectedBrand }) => {
  const brands = [
    "All",
    "Air Jordan",
    "Nike",
    "Timberland",
    "Amiri",
    "Adidas",
    "Asics",
    "Balenciaga",
    "Converse",
    "New Balance",
    "Puma",
    "Reebok",
    "Vans",
    "Yeezy",
    "Bape",
    "Dr. Martens",
    "Louis Vuitton",
    "Rick Owens",
    "Christian Dior",
  ];

  const sortedBrands = ["All", ...brands.slice(1).sort()];

  return (
    <nav className="px-3 pb-5 bg-[#ffffff00] flex justify-center items-center sticky top-20 w-full z-50">
      <div
        id="filters"
        className="flex gap-2 overflow-x-auto scrollbar-hide p-3 scroll-smooth">
        {sortedBrands.map((brand) => (
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
