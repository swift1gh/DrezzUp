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
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Scroll to the top whenever the selected brand changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedBrand]);

  const handleSearchBtn = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        Btn={"Calculate Combo"}
        Destination={`/combo?ids=${selectedProducts.join(",")}`}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isHome={true}
      />

      <main className="flex-grow">
        {!isSearchActive && (
          <Filter
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        )}

        {isSearchActive && (
          <div className="flex justify-center items-center sticky top-[5.5rem] z-50 pb-7">
            <div className=" bg-[#eae1e1] shadow-inner border-2 px-5 py-2 rounded-3xl w-80">
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

        <button
          onClick={handleSearchBtn}
          className="md:hidden fixed bottom-14 right-[-3rem] bg-[#d29c7b] rounded-full justify-center items-center shadow-2xl scale-110 hover:scale-125 w-[7rem]">
          <img src={searchIcon} className="h-5 m-2" />
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
