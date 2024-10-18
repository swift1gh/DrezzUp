import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AllProducts from "../components/AllProducts";
import Filter from "../components/Filter";
import Footer from "../components/Footer";
import searchIcon from "../assets/search.svg";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false); // New state to track search bar visibility

  // Scroll to the top whenever the selected brand changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedBrand]); // Run effect when selectedBrand changes

  const handleSearchBtn = () => {
    setIsSearchActive(!isSearchActive); // Toggle search bar and filter visibility
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        Btn={"Calculate Combo"}
        Destination={`/combo?ids=${selectedProducts.join(",")}`}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="flex-grow">
        {/* Conditionally render the Filter and Search bar based on isSearchActive */}
        {!isSearchActive && (
          <Filter
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        )}

        {/* Search bar */}
        {isSearchActive && (
          <div className="flex justify-center items-center sticky top-[5.5rem] z-50 pb-7">
            <div className=" bg-[#eae1e1] shadow-inner border-2 px-5 py-2 rounded-3xl w-80  ">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
                className="text-[#262424b9] md:hover:cursor-text w-full bg-[#eae1e1] border-none outline-none"
              />
            </div>
          </div>
        )}

        <AllProducts
          setSelectedProducts={setSelectedProducts}
          selectedBrand={selectedBrand}
          searchTerm={searchTerm}
        />

        {/* Search button */}
        <button
          onClick={handleSearchBtn} // Toggle search on button click
          className="md:hidden fixed bottom-10 right-7 bg-[#d29c7b] rounded-full justify-center items-center shadow-2xl hover:scale-105">
          <img src={searchIcon} className="h-5 m-2" />
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
