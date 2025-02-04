import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import Product from "./Product";
import WarningIcon from "../assets/warning.svg";
import { motion } from "motion/react";

const Selected = ({ selectedIds }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((product) => selectedIds.includes(product.id.toString())); // Convert id to string

        setSelectedProducts(products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedIds]);

  const totalComboPrice = selectedProducts.reduce(
    (total, prod) => total + prod.comboPrice,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching products: {error.message}</p>;
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
                <React.Suspense
                  fallback={
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto"
                    />
                  }>
                  <Product
                    Image={prod.image}
                    Color={prod.color}
                    singlePrice={`GHS ${prod.singlePrice}.00`}
                    Name={prod.name}
                  />
                </React.Suspense>
              </div>
            ))}
          </div>

          {selectedProducts.length > 1 ? (
            <div className="bg-[#cbcaca] w-11/12 md:w-4/5 py-4">
              <h2 className="flex justify-center text-center items-center gap-3 text-xl font-normal font-roboto">
                Combo Price:{" "}
                <span className="text-[#cf743c] font-mono font-bold">
                  {(() => {
                    let extraAmount = 0;
                    if (selectedProducts.length === 2) extraAmount = 200;
                    if (selectedProducts.length === 3) extraAmount = 300;
                    if (selectedProducts.length === 4) extraAmount = 400;

                    return `GHS ${(totalComboPrice + extraAmount).toFixed(2)}`;
                  })()}
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
