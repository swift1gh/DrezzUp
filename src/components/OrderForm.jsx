import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { motion } from "motion/react";

const OrderForm = ({ selectedIds = [], comboPrice = 0 }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    location: "",
    size: "",
    guarantorName: "",
    guarantorContact: "",
    addBox: false,
    selectedIds: selectedIds,
    comboPrice: comboPrice,
  });

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.contact ||
      !formData.location ||
      !formData.size ||
      !formData.guarantorName ||
      !formData.guarantorContact
    ) {
      setError("Please fill out all the required fields.");
      return;
    }

    setError("");

    const orderDate = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const orderData = {
      ...formData,
      date: orderDate,
      selectedIds,
      comboPrice,
    };

    try {
      const result = await addDoc(collection(db, "customers"), orderData);
      console.log("Order created with ID:", result.id);

      setPopupVisible(true);
      setTimeout(() => {
        setPopupVisible(false);
        navigate("/");
      }, 2000);

      setFormData({
        fullName: "",
        contact: "",
        location: "",
        size: "",
        guarantorName: "",
        guarantorContact: "",
        addBox: false,
        selectedIds: [],
        comboPrice: 0, // Ensure it resets correctly
      });
    } catch (error) {
      console.error("Error placing order:", error.message);
      setError("Failed to place order. Try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 200 }}
      transition={{ duration: 2 }}
      className="relative min-h-screen flex justify-center items-center mb-16 md:mb-12">
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

          {[
            { label: "Full Name", name: "fullName" },
            { label: "Contact", name: "contact" },
            { label: "Location", name: "location" },
            { label: "Size", name: "size" },
            { label: "Guarantor's Name", name: "guarantorName" },
            { label: "Guarantor's Contact", name: "guarantorContact" },
          ].map(({ label, name }) => (
            <div className="mb-4" key={name}>
              <label htmlFor={name} className="block font-medium mb-1">
                {label}:
              </label>
              <input
                type="text"
                name={name}
                id={name}
                className="w-full p-2 border border-gray-300 rounded"
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

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

      {isPopupVisible && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-2/3 md:w-1/3">
            <h2 className="text-xl font-bold text-green-600">
              Order Placed Successfully!
            </h2>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderForm;
