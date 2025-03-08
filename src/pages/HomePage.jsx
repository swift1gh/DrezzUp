import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AllProducts from "../components/AllProducts";
import Filter from "../components/Filter";
import Footer from "../components/Footer";
import searchIcon from "../assets/search.svg";
import SearchBar from "../components/SearchBar";
import { motion } from "framer-motion";
import UserTour from "../components/UserTour"; // Import UserTour

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
      {/* Include UserTour */}
      <UserTour />

      <Navbar
        Btn={"Calculate Combo"}
        Destination={`/combo?ids=${selectedProducts.join(",")}`}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isHome={true}
      />

      <main className="flex-grow">
        {!isSearchActive && (
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            transition={{ duration: 1.5 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="sticky top-20 z-50">
            <Filter
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
            />
          </motion.div>
        )}

        {/* Mobile Search Button  */}
        <button
          onClick={handleSearchBtn}
          id="mobile-search"
          className="md:hidden fixed bottom-14 right-[-3rem] bg-[#d29c7b] rounded-full justify-center items-center shadow-2xl scale-110 hover:scale-125 w-[7rem] z-[9000]">
          <img src={searchIcon} className="h-5 m-2" />
        </button>

        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex md:hidden justify-center items-center sticky top-[5.5rem] z-50 pb-7">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </motion.div>
        )}

        <AllProducts
          setSelectedProducts={setSelectedProducts}
          selectedBrand={selectedBrand}
          searchTerm={searchTerm}
        />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
