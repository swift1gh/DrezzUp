import React from "react";
import sneakers from "../sneakers.json";
import Product from "./Product";
import WarningIcon from "../assets/warning.svg";

const Selected = ({ selectedIds }) => {
  // This component doesn't need to manage its own state for selected products
  // It just filters the products based on the selectedIds passed down as props
  const selectedProducts = sneakers.products.filter((prod) =>
    selectedIds.includes(String(prod.id))
  );

  return (
    <div className="mb-10 mt-5">
      {selectedProducts.length === 0 ? (
        <div className="pt-28">
          <div className="flex justify-center items-center gap-2">
            <img src={WarningIcon} className="h-6" alt="" />
            <span>No Product Selected</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h2 className="p-2 font-mono font-medium">Selected Sneakers</h2>
          <div
            className={`${
              selectedProducts.length === 1
                ? "flex"
                : selectedProducts.length > 1 && selectedProducts.length < 4
                ? "md:flex"
                : "grid"
            } ${
              selectedProducts.length !== 1
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : ""
            } p-2`}>
            {selectedProducts.map((prod) => (
              <div className="scale-90">
                <Product
                  key={prod.id} // Ensure each product has a unique key
                  Image={prod.image}
                  Color={prod.color}
                  Price={prod.price}
                  Name={prod.name}
                />
              </div>
            ))}
          </div>

          {selectedIds.length > 1 ? (
            <div className="bg-[#cbcaca] w-11/12 md:w-4/5 py-4">
              <h2 className="flex justify-center text-center items-center gap-3 text-xl font-normal font-roboto">
                Combo Price:{" "}
                <span className="text-[#cf743c] font-mono font-bold">
                  GHS 1,700.00
                </span>
              </h2>
            </div>
          ) : (
            <div className="pt-5">
              <div className="flex justify-center items-center gap-2 px-8">
                <img src={WarningIcon} className="h-6" alt="" />
                <span>
                  The Combo Price Cannot Be Calculated With Only One Pair Of
                  Sneakers
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Selected;
