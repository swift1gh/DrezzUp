import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "motion/react";
import Product from "./Product";
import warningIcon from "../assets/warning.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const ITEMS_PER_PAGE = 12;

const AllProducts = ({ setSelectedProducts, selectedBrand, searchTerm }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSelectProduct = useCallback(
    (id) => {
      setSelectedProductIds((prevSelected) => {
        const newSelected = prevSelected.includes(id)
          ? prevSelected.filter((prodId) => prodId !== id)
          : [...prevSelected, id];

        setSelectedProducts(newSelected);
        return newSelected;
      });
    },
    [setSelectedProducts]
  );

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        productsList = shuffleArray(productsList);
        setProducts(productsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesBrand =
        selectedBrand === "All" ||
        prod.name.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesSearchTerm =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.color.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBrand && matchesSearchTerm;
    });
  }, [products, selectedBrand, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [selectedBrand, searchTerm]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-10">
      {error && <p>{error.message || error.toString()}</p>}

      {loading ? (
        <motion.div
          className="text-lg font-semibold text-gray-500"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}>
          Loading Sneakers...
        </motion.div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center gap-2 mt-[10%]">
          <img src={warningIcon} className="h-6" alt="Warning icon" />
          {selectedBrand === "All" ? (
            <p>No Sneakers Currently Available</p>
          ) : (
            <p>No {selectedBrand} Sneakers Currently Available</p>
          )}
        </div>
      ) : (
        <div className="gap-y-6 gap-x-[1.25rem] md:gap-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2">
          {visibleProducts.map((prod) => (
            <Product
              key={prod.id}
              Image={prod.image}
              Name={prod.name}
              Color={prod.color}
              singlePrice={`GHS ${prod.singlePrice}.00`}
              isSelected={selectedProductIds.includes(prod.id)}
              selectProduct={() => handleSelectProduct(prod.id)}
              loading={loading}
            />
          ))}
        </div>
      )}

      {visibleProducts.length < filteredProducts.length && (
        <button
          onClick={loadMore}
          className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
          Show More
        </button>
      )}
    </div>
  );
};

export default AllProducts;
