import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AllProducts from "../components/AllProducts";
import Filter from "../components/Filter";
import Footer from "../components/Footer";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");

  // Scroll to the top whenever the selected brand changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedBrand]); // Run effect when selectedBrand changes

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        Btn={"Calculate Combo"}
        Destination={`/combo?ids=${selectedProducts.join(",")}`}
      />

      <main className="flex-grow">
        <Filter
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <AllProducts
          setSelectedProducts={setSelectedProducts}
          selectedBrand={selectedBrand}
        />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
