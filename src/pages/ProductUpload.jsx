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
import { upload } from "../utils/storage";

const ProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(null);
  const [productSinglePrice, setProductSinglePrice] = useState("");
  const [productComboPrice, setProductComboPrice] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  // Fetch the highest ID and set the next ID
  useEffect(() => {
    const fetchHighestId = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching highest ID:", error);
        setMessage("Failed to fetch highest product ID.");
      }
    };

    fetchHighestId();
  }, []);

  const handleUpload = async () => {
    if (
      !productName ||
      !productSinglePrice ||
      !productComboPrice ||
      !productColor ||
      !productImageUrl
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    const parsedSinglePrice = parseFloat(productSinglePrice);
    const parsedComboPrice = parseFloat(productComboPrice);

    if (isNaN(parsedSinglePrice) || isNaN(parsedComboPrice)) {
      setMessage("Prices must be valid numbers.");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        id: productId,
        name: productName,
        color: productColor,
        image: productImageUrl,
        singlePrice: parsedSinglePrice,
        comboPrice: parsedComboPrice,
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileLoading(true);
    const response = await upload(file);
    setFileLoading(false);
    setProductImageUrl(response.url);
  };

  return (
    <div className="flex text-center items-center justify-center h-screen bg-slate-600 ">
      <div className="flex flex-col justify-center items-center p-10 bg-[#FBF4F4] shadow-md rounded-lg w-[80%] lg:max-w-3xl">
        <h2 className="text-lg font-bold mb-4">Upload Product</h2>
        {message && <p className="text-green-600">{message}</p>}
        <input
          type="text"
          placeholder="Product ID"
          value={`Product ${productId}` || ""}
          readOnly
          className="p-2 w-full px-5 m-2 border text-center border-gray-200 rounded bg-gray-300 cursor-default"
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="p-2 w-full px-5 m-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Single Price"
          value={productSinglePrice}
          onChange={(e) => setProductSinglePrice(e.target.value)}
          className="p-2 w-full px-5 m-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Combo Price"
          value={productComboPrice}
          onChange={(e) => setProductComboPrice(e.target.value)}
          className="p-2 w-full px-5  m-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Color"
          value={productColor}
          onChange={(e) => setProductColor(e.target.value)}
          className="p-2 w-full px-5 m-2 border border-gray-300 rounded"
        />
        <div>
          {" "}
          <input
            type="file"
            onChange={handleFileUpload}
            className="p-2 w-full px-5  m-2 border border-gray-300 rounded"
          />
          {fileLoading && <p>uploading</p>}
          {productImageUrl && (
            <img
              src={productImageUrl}
              width={400}
              height={300}
              className="max-w-full object-contain h-auto h"
              alt="drezzup shoes"
            />
          )}
        </div>

        <button
          onClick={handleUpload}
          className="p-3 bg-blue-600 hover:bg-blue-700 m-2 rounded-lg text-white w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ProductUpload;
