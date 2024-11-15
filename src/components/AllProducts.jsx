import React, { useState, useEffect } from "react";
import Product from "./Product";
import warningIcon from "../assets/warning.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

const AllProducts = ({ setSelectedProducts, selectedBrand, searchTerm }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSelectProduct = (id) => {
    const newSelectedProducts = selectedProductIds.includes(id)
      ? selectedProductIds.filter((prodId) => prodId !== id)
      : [...selectedProductIds, id];

    setSelectedProductIds(newSelectedProducts);
    setSelectedProducts(newSelectedProducts);
  };

  // Shuffle function (Fisher-Yates)
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

        // Shuffle the products list
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

  const filteredProducts = products.filter((prod) => {
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
      {error && <p>{error.message || error.toString()}</p>}

      {loading ? (
        <p>Loading...</p> // Show loading indicator while loading is true
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
          {filteredProducts.map((prod) => (
            <Product
              key={prod.id}
              Image={prod.image}
              Name={prod.name}
              Color={prod.color}
              singlePrice={`GHS ${prod.singlePrice}.00`}
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
