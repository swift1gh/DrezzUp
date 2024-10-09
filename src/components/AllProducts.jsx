import React from "react";
import Product from "./Product";
import sneakers from "../sneakers.json";
import { useState } from "react";

const AllProducts = ({ setSelectedProducts }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const handleSelectProduct = (id) => {
    // Toggle the selected product in the list
    if (selectedProductIds.includes(id)) {
      const newSelectedProducts = selectedProductIds.filter(
        (prodId) => prodId !== id
      );
      setSelectedProductIds(newSelectedProducts);
      setSelectedProducts(newSelectedProducts); // Update HomePage state
    } else {
      const newSelectedProducts = [...selectedProductIds, id];
      setSelectedProductIds(newSelectedProducts);
      setSelectedProducts(newSelectedProducts); // Update HomePage state
    }
  };

  return (
    <div className="flex justify-center items-center mt-24 mb-10 ">
      <div className="gap-y-6 gap-x-[1.25rem] md:gap-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 ">
        {sneakers.products.map((prod) => (
          <Product
            key={prod.id}
            Image={prod.image}
            Name={prod.name}
            Color={prod.color}
            Price={prod.price}
            isSelected={selectedProductIds.includes(prod.id)} // Check if it's selected
            selectProduct={() => handleSelectProduct(prod.id)} // Pass the handler
          />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
