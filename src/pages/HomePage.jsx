import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AllProducts from "../components/AllProducts";
import Filter from "../components/Filter";
import Footer from "../components/Footer";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar
          Btn={"Calculate Combo"}
          Destination={`/combo?ids=${selectedProducts.join(",")}`}
        />
      </header>

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
