import React from "react";
import Navbar from "./components/Navbar";
import Filter from "./components/Filter";
import AllProducts from "./components/AllProducts";

const App = () => {
  return (
    <div>
      <Navbar />
      <AllProducts />
    </div>
  );
};

export default App;
