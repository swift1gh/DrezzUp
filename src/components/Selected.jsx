import React, { useEffect, useState } from "react";
import Product from "./Product";
import WarningIcon from "../assets/warning.svg";

const Selected = ({ selectedIds }) => {
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the sneakers data from the public folder
    fetch("/sneakers.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSneakers(data.products); // Assuming data has a "products" key
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Filter selected products based on selectedIds passed as props
  const selectedProducts = sneakers.filter((prod) =>
    selectedIds.includes(String(prod.id))
  );

  // Calculate total combo price
  const totalComboPrice = selectedProducts.reduce(
    (total, prod) => total + prod.comboPrice,
    0
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="mb-10 mt-5">
      {selectedProducts.length === 0 ? (
        <div className="pt-28">
          <div className="flex justify-center items-center gap-2">
            <img src={WarningIcon} className="h-6" alt="Warning" />
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
              <div key={prod.id} className="scale-90">
                <Product
                  Image={prod.image}
                  Color={prod.color}
                  comboPrice={`GHS ${prod.comboPrice}.00`}
                  Name={prod.name}
                />
              </div>
            ))}
          </div>

          {selectedProducts.length > 1 ? (
            <div className="bg-[#cbcaca] w-11/12 md:w-4/5 py-4">
              <h2 className="flex justify-center text-center items-center gap-3 text-xl font-normal font-roboto">
                Combo Price:{" "}
                <span className="text-[#cf743c] font-mono font-bold">
                  GHS {totalComboPrice.toFixed(2)}
                </span>
              </h2>
            </div>
          ) : (
            <div className="pt-5">
              <div className="flex justify-center items-center gap-2 px-8">
                <img src={WarningIcon} className="h-6" alt="Warning" />
                <span>
                  The Combo Price Cannot Be Calculated On Only One Pair Of
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
