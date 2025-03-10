import React from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { upload } from "../../utils/storage";
import ImageUploader from "./ImageUploader";

const ProductUploadForm = ({
  productId,
  productName,
  setProductName,
  productSinglePrice,
  setProductSinglePrice,
  productComboPrice,
  setProductComboPrice,
  productColor,
  setProductColor,
  productImageUrl,
  setProductImageUrl,
  setProductId,
  fileLoading,
  setFileLoading,
  showMessage,
  toggleForm
}) => {
  const [processedFile, setProcessedFile] = React.useState(null);

  const handleImageProcessed = (file) => {
    setProcessedFile(file);
    window.processedFileToUpload = file;
  };

  const handleUpload = async () => {
    // Enhanced input validation
    if (!productName || productName.trim() === "") {
      showMessage("Please enter a valid product name.", "error");
      return;
    }

    if (!productSinglePrice || productSinglePrice.trim() === "") {
      showMessage("Please enter a valid single price.", "error");
      return;
    }

    if (!productComboPrice || productComboPrice.trim() === "") {
      showMessage("Please enter a valid combo price.", "error");
      return;
    }

    if (!productColor || productColor.trim() === "") {
      showMessage("Please enter a valid product color.", "error");
      return;
    }

    // Check if we have a file to upload
    if (!processedFile && !productImageUrl) {
      showMessage("Please select an image file.", "error");
      return;
    }

    const parsedSinglePrice = parseFloat(productSinglePrice);
    const parsedComboPrice = parseFloat(productComboPrice);

    if (isNaN(parsedSinglePrice) || isNaN(parsedComboPrice)) {
      showMessage("Prices must be valid numbers.", "error");
      return;
    }

    if (parsedSinglePrice <= 0 || parsedComboPrice <= 0) {
      showMessage("Prices must be greater than zero.", "error");
      return;
    }

    setFileLoading(true);
    try {
      showMessage("Uploading product...", "info");
      console.log("Uploading product with ID:", productId);
      
      // Upload the image if we have a processed file waiting
      let imageUrl = productImageUrl;
      if (processedFile) {
        try {
          console.log("Uploading image to storage...");
          const uploadResponse = await upload(processedFile);
          console.log("Image uploaded successfully:", uploadResponse);
          
          // Use cloudinaryUrl if available, otherwise use firebaseUrl
          imageUrl = uploadResponse.cloudinaryUrl || uploadResponse.firebaseUrl || uploadResponse.url;
          
          // Clear the stored file after successful upload
          setProcessedFile(null);
          window.processedFileToUpload = null;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showMessage(`Error uploading image: ${uploadError.message}`, "error");
          setFileLoading(false);
          return;
        }
      }
      
      // Create the product object
      const productData = {
        id: productId,
        name: productName.trim(),
        color: productColor.trim(),
        image: imageUrl,
        singlePrice: parsedSinglePrice,
        comboPrice: parsedComboPrice,
        createdAt: new Date().toISOString()
      };
      
      // Add to Firestore
      await addDoc(collection(db, "products"), productData);
      
      // Clear form and show success message
      showMessage("Product uploaded successfully!", "success");
      setProductName("");
      setProductId((prevId) => prevId + 1); // Increment productId for the next product
      setProductSinglePrice("");
      setProductComboPrice("");
      setProductColor("");
      setProductImageUrl("");
    } catch (error) {
      console.error("Error uploading product:", error);
      showMessage(`Error uploading product: ${error.message}`, "error");
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-gray-200 p-3 rounded-lg text-center mb-4">
        <span className="font-medium">Product {productId}</span>
      </div>
      
      {/* Image Preview */}
      {productImageUrl && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-center">
            <img 
              src={productImageUrl} 
              alt="Product Preview" 
              className="h-48 object-contain rounded-lg shadow-sm"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">Image Preview</p>
        </div>
      )}
      
      <form className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Single Price"
              value={productSinglePrice}
              onChange={(e) => setProductSinglePrice(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₵</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Combo Price"
              value={productComboPrice}
              onChange={(e) => setProductComboPrice(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₵</span>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Color"
            value={productColor}
            onChange={(e) => setProductColor(e.target.value)}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        <ImageUploader 
          fileLoading={fileLoading}
          setFileLoading={setFileLoading}
          showMessage={showMessage}
          onImageProcessed={handleImageProcessed}
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={fileLoading}
          className={`flex items-center justify-center gap-2 bg-[#BD815A] text-white font-medium p-3 rounded-lg hover:bg-[#a06b4a] transition-colors duration-200 shadow-md mt-2 ${
            fileLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {fileLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing...
            </>
          ) : (
            "Upload Product"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={toggleForm}
          className="text-[#BD815A] hover:text-[#a06b4a] transition-colors duration-200 text-sm underline flex items-center justify-center gap-1 mx-auto">
          <FaTrash className="text-xs" />
          Want to delete a product?
        </button>
      </div>
    </div>
  );
};

export default ProductUploadForm;
