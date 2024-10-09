import React from "react";
import sneakers from "../sneakers.json";
import Product from "./Product";
import WarningIcon from "../assets/warning.svg";

const Selected = ({ selectedIds }) => {
  const selectedProducts = sneakers.products.filter((prod) =>
    selectedIds.includes(String(prod.id))
  );

  return (
    <div className="mt-24 mb-10">
      {selectedProducts.length === 0 ? (
        <div className="pt-28">
          <div className="flex justify-center items-center gap-2">
            <img src={WarningIcon} className="h-6" alt="" />
            <span>No Product Selected</span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="gap-y-6 gap-x-[1.25rem] md:gap-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2 ">
            {selectedProducts.map((prod) => (
              <Product
                Image={prod.image}
                Color={prod.color}
                Price={prod.price}
                Name={prod.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Selected;
