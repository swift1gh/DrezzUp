import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AllProducts from "../components/AllProducts";
import Filter from "../components/Filter";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");

  return (
    <div>
      <Navbar
        Btn={"Calculate Combo"}
        Destination={`/combo?ids=${selectedProducts.join(",")}`}
      />
      <Filter
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
      <AllProducts
        setSelectedProducts={setSelectedProducts}
        selectedBrand={selectedBrand}
      />
    </div>
  );
};

export default HomePage;
