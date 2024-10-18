import React, { useState, useEffect } from "react";
import Product from "./Product";
import sneakers from "../sneakers.json";
import warningIcon from "../assets/warning.svg";

const AllProducts = ({ setSelectedProducts, selectedBrand, searchTerm }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [shuffledProducts, setShuffledProducts] = useState([]);

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

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const storedShuffledProducts = localStorage.getItem("shuffledProducts");

    if (storedShuffledProducts) {
      setShuffledProducts(JSON.parse(storedShuffledProducts));
    } else {
      const shuffled = shuffleArray(sneakers.products);
      setShuffledProducts(shuffled);
      localStorage.setItem("shuffledProducts", JSON.stringify(shuffled));
    }
  }, []);

  // Filter products based on selected brand, search term (name or color)
  const filteredProducts = shuffledProducts.filter((prod) => {
    const matchesBrand =
      selectedBrand === "All" ||
      prod.name.toLowerCase().includes(selectedBrand.toLowerCase());
    const matchesSearchTerm =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.color.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearchTerm;
  });

  return (
    <div className="flex justify-center items-center mb-10">
      {filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center gap-2 mt-[10%]">
          <img src={warningIcon} className="h-6" alt="" />
          <p>No {selectedBrand} Sneakers Currently Available</p>
        </div>
      ) : (
        <div className="gap-y-6 gap-x-[1.25rem] md:gap-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 ">
          {filteredProducts.map((prod) => (
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
