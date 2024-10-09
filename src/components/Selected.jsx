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
        <div className="flex flex-col justify-center items-center gap-5">
          <h2 className="p-2 font-mono font-medium">Selected Sneakers</h2>
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

          <div className="bg-[#b9b8b8] w-4/5 py-4">
            <h2 className="flex justify-center text-center items-center gap-3 text-xl font-normal font-roboto">
              Combo Price:{" "}
              <span className="text-[#9F4B15] font-mono font-bold">
                GHS 1,700.00
              </span>
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Selected;
