import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    location: "",
    size: "",
    guarantorName: "",
    guarantorContact: "",
    addBox: false,
  });

  const [isPopupVisible, setPopupVisible] = useState(false); // State to manage popup visibility
  const [error, setError] = useState(""); // State to show error message
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: Check if all required fields are filled
    if (
      !formData.fullName ||
      !formData.contact ||
      !formData.location ||
      !formData.size ||
      !formData.guarantorName ||
      !formData.guarantorContact
    ) {
      setError("Please fill out all the required fields.");
      return; // Prevent submission if validation fails
    }

    setError(""); // Clear any previous error message

    try {
      const result = await addDoc(collection(db, "customers"), formData);
      console.log(result);
    } catch (error) {
      console.error(error.message);
    }

    // Log formData to check the input values before submission
    console.log("Form Data before submission:", formData);

    // Show the pop-up when form is submitted
    setPopupVisible(true);

    // Hide the pop-up after 5 seconds and redirect to the homepage
    setTimeout(() => {
      setPopupVisible(false);
      navigate("/"); // Redirect to the homepage after the pop-up disappears
    }, 5000); // 5 seconds

    // Log formData after resetting the form
    setFormData({
      fullName: "",
      contact: "",
      location: "",
      size: "",
      guarantorName: "",
      guarantorContact: "",
      addBox: false,
    });
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center">
      {/* Apply blur when the pop-up is visible */}
      <div
        className={`w-full flex justify-center items-center ${
          isPopupVisible ? "blur-md" : ""
        }`}>
        <form
          className="bg-white p-8 rounded-lg drop-shadow-lg w-full max-w-md"
          onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-6">
            To place your order, please fill out the form below:
          </h2>

          {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}

          <div className="mb-4">
            <label htmlFor="fullName" className="block font-medium mb-1">
              Full Name:
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contact" className="block font-medium mb-1">
              Contact:
            </label>
            <input
              type="text"
              name="contact"
              id="contact"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block font-medium mb-1">
              Location:
            </label>
            <input
              type="text"
              name="location"
              id="location"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="size" className="block font-medium mb-1">
              Size:
            </label>
            <input
              type="text"
              name="size"
              id="size"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.size}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="guarantorName" className="block font-medium mb-1">
              Guarantor's Name:
            </label>
            <input
              type="text"
              name="guarantorName"
              id="guarantorName"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.guarantorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="guarantorContact"
              className="block font-medium mb-1">
              Guarantor's Contact:
            </label>
            <input
              type="text"
              name="guarantorContact"
              id="guarantorContact"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.guarantorContact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="addBox"
              id="addBox"
              className="mr-2"
              checked={formData.addBox}
              onChange={handleChange}
            />
            <label htmlFor="addBox" className="font-medium">
              Add Box
            </label>
          </div>

          <div className="mb-4 text-sm text-orange-600 bg-[#FBF4F4] p-4 rounded">
            <p>
              &#9888; Kindly note that these deals don’t come in boxes. A box
              costs 20 cedis. It can be added by your choice and the price
              factored in.
            </p>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-[#b0713e] text-white font-bold rounded hover:bg-[#9d6134]">
            Place Order
          </button>
        </form>
      </div>

      {/* Pop-up overlay with blur effect */}
      {isPopupVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-2/3 md:w-1/3">
            <h2 className="text-xl font-bold text-green-600">
              Order Placed Successfully!
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
