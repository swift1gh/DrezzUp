import React, { useState } from "react";
import Product from "./Product";
import sneakers from "../sneakers.json";

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

  // Filter products based on the selected brand
  const filteredProducts =
    selectedBrand === "All"
      ? sneakers.products
      : sneakers.products.filter((prod) =>
          prod.name.toLowerCase().includes(selectedBrand.toLowerCase())
        );

  return (
    <div className="flex justify-center items-center mb-10">
      {filteredProducts.length === 0 ? (
        <p>No {selectedBrand} Sneakers Currently Available</p>
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
