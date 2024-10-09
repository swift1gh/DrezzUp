import React, { useState } from "react";
import Navbar from "../components/Navbar";
import AllProducts from "../components/AllProducts";

const HomePage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  return (
    <div>
      <Navbar
        Btn={"Calculate Combo"}
        Destination={`/combo?ids=${selectedProducts.join(",")}`}
      />
      <AllProducts setSelectedProducts={setSelectedProducts} />
    </div>
  );
};

export default HomePage;
