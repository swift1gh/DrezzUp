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
    // Check if the page was refreshed using the performance API
    const isPageReloaded = () => {
      const navEntries = window.performance.getEntriesByType("navigation");
      return navEntries.length > 0 && navEntries[0].type === "reload";
    };

    const storedShuffledProducts = sessionStorage.getItem("shuffledProducts");

    if (storedShuffledProducts) {
      // If shuffled products exist in session storage, use them
      setShuffledProducts(JSON.parse(storedShuffledProducts));
    } else if (isPageReloaded()) {
      // If the page was reloaded, shuffle the products and store in session storage
      const shuffled = shuffleArray(sneakers.products);
      setShuffledProducts(shuffled);
      sessionStorage.setItem("shuffledProducts", JSON.stringify(shuffled));
    } else {
      // If not reloaded and no stored shuffled products, use the default order
      setShuffledProducts(sneakers.products);
    }
  }, []); // This will run once when the component mounts

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
          {selectedBrand === "All" ? (
            <p>No Sneakers Currently Available</p>
          ) : (
            <p>No {selectedBrand} Sneakers Currently Available</p>
          )}
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
