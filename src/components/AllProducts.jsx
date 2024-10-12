import React, { useState } from "react";
import Product from "./Product";
import sneakers from "../sneakers.json";
import warningIcon from "../assets/warning.svg";

const AllProducts = ({ setSelectedProducts, selectedBrand }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  const handleSelectProduct = (id) => {
    if (selectedProductIds.includes(id)) {
      const newSelectedProducts = selectedProductIds.filter(
        (prodId) => prodId !== id
      );
      setSelectedProductIds(newSelectedProducts);
      setSelectedProducts(newSelectedProducts);
    } else {
      const newSelectedProducts = [...selectedProductIds, id];
      setSelectedProductIds(newSelectedProducts);
      setSelectedProducts(newSelectedProducts);
    }
  };

  // Fisher-Yates shuffle to randomize the products array
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Filter products based on the selected brand
  const filteredProducts =
    selectedBrand === "All"
      ? sneakers.products
      : sneakers.products.filter((prod) =>
          prod.name.toLowerCase().includes(selectedBrand.toLowerCase())
        );

  // Shuffle the filtered products
  const shuffledProducts = shuffleArray(filteredProducts);

  return (
    <div className="flex justify-center items-center mb-10">
      {shuffledProducts.length === 0 ? (
        <div className="flex justify-center items-center gap-2 mt-[10%]">
          <img src={warningIcon} className="h-6" alt="" />
          <p>No {selectedBrand} Sneakers Currently Available</p>
        </div>
      ) : (
        <div className="gap-y-6 gap-x-[1.25rem] md:gap-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 ">
          {shuffledProducts.map((prod) => (
            <Product
              key={prod.id}
              Image={prod.image}
              Name={prod.name}
              Color={prod.color}
              Price={prod.price}
              isSelected={selectedProductIds.includes(prod.id)}
              selectProduct={() => handleSelectProduct(prod.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
