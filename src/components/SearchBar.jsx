import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex justify-between items-center gap-1 bg-[#eae1e1] shadow-inner px-2 py-2 rounded-3xl md:w-60 lg:w-80 relative border border-gray-500">
      <input
        type="text"
        placeholder="Find your sneakers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
        required
        className="text-[#262424b9] pl-2 md:hover:cursor-text w-full bg-[#eae1e1] border-none outline-none"
      />
      {
        /* Show clear button when the search bar is active*/
        searchTerm && (
          <button
            onClick={() => setSearchTerm("")} // Clear the search bar
            className="bg-[#413f3f19] hover:bg-[#aa8974ac] hover:text-gray-600 rounded-full flex justify-center items-center px-2 text-[#925835a7] text-sm">
            CLEAR
          </button>
        )
      }
    </div>
  );
};

export default SearchBar;
