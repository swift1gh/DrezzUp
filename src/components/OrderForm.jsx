import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { motion } from "motion/react";

const getDefaultFormState = (selectedIds = [], comboPrice = 0) => ({
  fullName: "",
  contact: "",
  location: "",
  size: "",
  guarantorName: "",
  guarantorContact: "",
  addBox: "0",
  selectedIds,
  comboPrice,
});

const OrderForm = ({ selectedIds = [], comboPrice = 0 }) => {
  const [formData, setFormData] = useState(
    getDefaultFormState(selectedIds, comboPrice)
  );
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (Object.values(formData).some((value) => value === "")) {
        setError("Please fill out all required fields.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const orderData = {
          ...formData,
          date: Timestamp.now(),
          selectedIds,
          comboPrice,
        };

        const result = await addDoc(collection(db, "customers"), orderData);
        console.log("Order created with ID:", result.id);

        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          navigate("/");
        }, 2000);

        setFormData(getDefaultFormState());
      } catch (error) {
        console.error("Error placing order:", error.message);
        setError("Failed to place order. Try again later.");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, selectedIds, comboPrice]
  );

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

          <div className="flex w-full justify-between items-center mb-4">
            <label htmlFor="addBox" className="font-medium">
              Number of Boxes:
            </label>
            <select
              name="addBox"
              id="addBox"
              className="w-1/2 p-2 border border-gray-300 rounded ml-2"
              value={formData.addBox}
              onChange={handleChange}>
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
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
            className={`w-full p-2 text-white font-bold rounded ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#b0713e] hover:bg-[#9d6134]"
            }`}
            disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
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
