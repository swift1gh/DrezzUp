import React from "react";
import Product from "./Product";
import sneakers from "../sneakers.json";

const AllProducts = () => {
  const products = sneakers.products;

  return (
    <div className="md:flex justify-center items-center my-10 gap-5 md:gap-10 grid grid-cols-2 p-2">
      {products.map((prod) => (
        <Product
          key={prod.id}
          Image={prod.image}
          Name={prod.name}
          Color={prod.color}
          Price={prod.price}
        />
      ))}
    </div>
  );
};

export default AllProducts;
