import React from "react";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { upload } from "../../utils/storage";
import removeBg from "../../utils/removeBg";

const ImageUploader = ({ 
  fileLoading, 
  setFileLoading, 
  showMessage, 
  onImageProcessed 
}) => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      showMessage("Please upload a valid image file (PNG or JPEG).", "error");
      return;
    }

    setFileLoading(true);
    showMessage("Processing image...", "info");

    try {
      // First try to remove background
      let processedImageUrl;
      try {
        console.log("Removing background from image...");
        processedImageUrl = await removeBg(file);
      } catch (bgError) {
        console.error("Background removal failed:", bgError);
        showMessage("Background removal failed. Uploading original image...", "info");
        processedImageUrl = null;
      }

      // If background removal fails, use the original file
      let fileToUpload = file;
      
      // If background removal succeeded, convert URL to File
      if (processedImageUrl) {
        try {
          const response = await fetch(processedImageUrl);
          const blob = await response.blob();
          fileToUpload = new File([blob], file.name, { type: "image/png" });
        } catch (conversionError) {
          console.error("Error converting blob URL to File:", conversionError);
          fileToUpload = file; // Fallback to original file
        }
      }

      // Store the file for later upload instead of uploading immediately
      setFileLoading(false);
      showMessage("Image processed successfully! Click 'Upload Product' to complete.", "success");
      
      // Pass the processed file to the parent component
      onImageProcessed(fileToUpload);
    } catch (error) {
      console.error("Error processing image:", error);
      showMessage(`Error processing image: ${error.message}. Please try again.`, "error");
      setFileLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="flex-1">
        <div className="bg-[#BD815A] text-white font-medium p-3 rounded-lg hover:bg-[#a06b4a] transition-colors duration-200 shadow-md text-center cursor-pointer flex items-center justify-center">
          <FaUpload className="mr-2" />
          Choose File
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </label>
      <span className="text-sm text-gray-500 flex-1 truncate">
        {fileLoading
          ? "Uploading..."
          : window.processedFileToUpload
          ? "File processed"
          : "No file chosen"}
      </span>
    </div>
  );
};

export default ImageUploader;
