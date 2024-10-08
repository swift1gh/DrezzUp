import React, { useState } from "react";
import sneakers from "../sneakers.json";
import Product from "./Product";

const AllProducts = () => {
  const [selectedProducts, setSelectedProducts] = useState([]); // Store selected product IDs

  const handleSelectProduct = (id) => {
    // Toggle the selected product in the list
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((prodId) => prodId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="my-10 gap-y-6 gap-x-[1.25rem] md:gap-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 ">
        {sneakers.products.map((prod) => (
          <Product
            key={prod.id}
            Image={prod.image}
            Name={prod.name}
            Color={prod.color}
            Price={prod.price}
            isSelected={selectedProducts.includes(prod.id)} // Check if it's selected
            selectProduct={() => handleSelectProduct(prod.id)} // Pass the handler
          />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
