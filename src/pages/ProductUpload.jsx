import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../utils/firebase"; // Adjust path to your Firebase config file
import { upload } from "../utils/storage";
import removeBg from "../utils/removeBg";

const ProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(null);
  const [productSinglePrice, setProductSinglePrice] = useState("");
  const [productComboPrice, setProductComboPrice] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const [deleteProductName, setDeleteProductName] = useState("");
  const [deleteProductColor, setDeleteProductColor] = useState("");
  const [deleteProductImageUrl, setDeleteProductImageUrl] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isDeleteForm, setIsDeleteForm] = useState(false);

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

        const highestId = !querySnapshot.empty
          ? querySnapshot.docs[0].data().id
          : 0;
        console.log("Highest ID fetched:", highestId);
        setProductId(highestId + 1);
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
      console.log("Uploading product with ID:", productId);
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

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      setMessage("Please upload a valid image file (PNG or JPEG).");
      return;
    }

    setFileLoading(true);

    try {
      console.log("Removing background from image...");
      const bgRemovedImageUrl = await removeBg(file);
      if (!bgRemovedImageUrl) {
        throw new Error("Background removal failed.");
      }

      // Convert URL to a File object for Cloudinary upload
      const response = await fetch(bgRemovedImageUrl);
      const blob = await response.blob();
      const processedFile = new File([blob], file.name, { type: file.type });

      console.log("Uploading image to Cloudinary and Firebase...");
      const uploadResponse = await upload(processedFile);
      console.log("Image uploaded successfully:", uploadResponse);
      setProductImageUrl(uploadResponse.url);
      setMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Error processing image:", error);
      setMessage("Error processing image. Try again.");
    } finally {
      setFileLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (isDeleteForm) {
        if (!deleteProductName || !deleteProductColor) {
          setMessage("Please fill in both fields.");
          return;
        }

        setDeleteLoading(true);

        try {
          const productsRef = collection(db, "products");
          const productQuery = query(
            productsRef,
            where("name", "==", deleteProductName),
            where("color", "==", deleteProductColor)
          );
          const querySnapshot = await getDocs(productQuery);

          if (!querySnapshot.empty) {
            const product = querySnapshot.docs[0].data();
            setDeleteProductId(querySnapshot.docs[0].id);
            setDeleteProductImageUrl(product.image);
            setMessage("Product found. Confirm deletion.");
          } else {
            setMessage("Product not found.");
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setMessage("Error fetching product.");
        } finally {
          setDeleteLoading(false);
        }
      }
    };

    fetchProduct();
  }, [deleteProductName, deleteProductColor]);

  const handleDeleteProduct = async () => {
    if (!deleteProductId) {
      setMessage("No product selected for deletion.");
      return;
    }

    try {
      console.log("Deleting product with ID:", deleteProductId);
      await deleteDoc(doc(db, "products", deleteProductId));
      setMessage("Product deleted successfully!");
      setDeleteProductName("");
      setDeleteProductColor("");
      setDeleteProductImageUrl("");
      setDeleteProductId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Error deleting product.");
    }
  };

  const toggleForm = () => {
    setIsDeleteForm(!isDeleteForm);
    setMessage("");
  };

  return (
    <div className="flex text-center items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center p-10 bg-white shadow-md rounded-lg w-2/3 lg:max-w-3xl">
        <h2 className="text-lg font-bold mb-4">
          {isDeleteForm ? "Delete Product" : "Upload Product"}
        </h2>
        {message && <p className="text-green-600">{message}</p>}
        {isDeleteForm ? (
          <div>
            <input
              type="text"
              placeholder="Product Name"
              value={deleteProductName}
              onChange={(e) => setDeleteProductName(e.target.value)}
              className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Color"
              value={deleteProductColor}
              onChange={(e) => setDeleteProductColor(e.target.value)}
              className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
            />
            {deleteLoading && <p>Loading...</p>}
            {deleteProductImageUrl && (
              <div className="flex text-center justify-center">
                <img
                  src={deleteProductImageUrl}
                  width={200}
                  height={100}
                  className="max-w-full object-contain h-auto rounded-md"
                  alt="drezzup shoes"
                />
              </div>
            )}
            <button
              onClick={handleDeleteProduct}
              className="p-3 bg-red-600 hover:bg-red-700 my-2 rounded-lg text-white w-full">
              Delete Product
            </button>
            <p
              className="text-blue-900 font-thin italic cursor-pointer hover:text-gray-500"
              onClick={toggleForm}>
              Want to upload a product?
            </p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Product ID"
              value={`Product ${productId}` || ""}
              readOnly
              className="p-2 w-full px-5 my-2 border text-center border-gray-200 rounded bg-gray-300 cursor-default"
            />
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Single Price"
              value={productSinglePrice}
              onChange={(e) => setProductSinglePrice(e.target.value)}
              className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Combo Price"
              value={productComboPrice}
              onChange={(e) => setProductComboPrice(e.target.value)}
              className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Color"
              value={productColor}
              onChange={(e) => setProductColor(e.target.value)}
              className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
            />
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept="image/png, image/jpeg"
                className="p-2 w-full px-5 my-2 border border-gray-300 rounded"
              />
              {fileLoading && <p>Uploading...</p>}
              {productImageUrl && (
                <img
                  src={productImageUrl}
                  width={400}
                  height={560} // 5:7 aspect ratio
                  className="max-w-full object-contain h-auto mx-auto"
                  alt="drezzup shoes"
                />
              )}
            </div>
            <button
              onClick={handleUpload}
              className="p-3 bg-blue-600 hover:bg-blue-700 my-2 rounded-lg text-white w-full">
              Submit
            </button>
            <p
              className="text-blue-900 font-thin italic cursor-pointer hover:text-gray-500"
              onClick={toggleForm}>
              Want to delete a product?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductUpload;
