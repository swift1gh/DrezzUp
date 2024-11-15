import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../utils/firebase"; // Adjust path to your Firebase config file

const ProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(null);
  const [productSinglePrice, setProductSinglePrice] = useState("");
  const [productComboPrice, setProductComboPrice] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [message, setMessage] = useState("");

  // Fetch the highest ID and set the next ID
  useEffect(() => {
    const fetchHighestId = async () => {
      const productsRef = collection(db, "products");
      const highestIdQuery = query(
        productsRef,
        orderBy("id", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(highestIdQuery);

      if (!querySnapshot.empty) {
        const highestId = querySnapshot.docs[0].data().id;
        setProductId(highestId + 1);
      } else {
        setProductId(1); // Start with ID 1 if no products exist
      }
    };

    fetchHighestId();
  }, []);

  const handleUpload = async () => {
    try {
      await addDoc(collection(db, "products"), {
        id: productId,
        name: productName,
        color: productColor,
        image: productImageUrl,
        singlePrice: parseFloat(productSinglePrice),
        comboPrice: parseFloat(productComboPrice),
      });
      setMessage("Product uploaded successfully!");
      setProductName("");
      setProductId((prevId) => prevId + 1); // Increment productId for the next product
      setProductSinglePrice("");
      setProductComboPrice("");
      setProductColor("");
      setProductImageUrl("");
    } catch (error) {
      console.error("Error uploading product:", error);
      setMessage("Error uploading product.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-5">
      <h2 className="text-lg font-bold mb-4">Upload Product</h2>
      {message && <p className="text-green-600">{message}</p>}
      <input
        type="text"
        placeholder="Product ID"
        value={productId || ""}
        readOnly
        className="p-2 m-2 border border-gray-300 rounded bg-gray-100"
      />
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="p-2 m-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Single Price"
        value={productSinglePrice}
        onChange={(e) => setProductSinglePrice(e.target.value)}
        className="p-2 m-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Combo Price"
        value={productComboPrice}
        onChange={(e) => setProductComboPrice(e.target.value)}
        className="p-2 m-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Color"
        value={productColor}
        onChange={(e) => setProductColor(e.target.value)}
        className="p-2 m-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={productImageUrl}
        onChange={(e) => setProductImageUrl(e.target.value)}
        className="p-2 m-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleUpload}
        className="p-3 bg-gray-600 m-2 rounded-lg text-white">
        Submit
      </button>
    </div>
  );
};

export default ProductUpload;
