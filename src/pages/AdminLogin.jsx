import React, { useState } from "react";
import { auth } from "../utils/firebase"; // Make sure this path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [adminPassword, setAdminPassword] = useState({
    email: "drezzup@gmail.com",
    password: "",
  });
  const [error, setError] = useState(""); // State for storing error messages

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminPassword({
      ...adminPassword,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before login attempt

    try {
      // Firebase sign-in with email and password
      const response = await signInWithEmailAndPassword(
        auth,
        adminPassword.email,
        adminPassword.password
      );
      console.log("Login Successful", response.user); // Log user object to ensure success

      // Navigate to admin dashboard after successful login
      navigate("/adminDashboard");
    } catch (error) {
      console.error(error.message);
      setError("Invalid email or password"); // Set error message on failure
    }
  };

  return (
    <div className="bg-[#1e1e1f]">
      <div className="scale-90 md:scale-100 flex justify-center items-center h-[100vh] w-full text-white">
        <div className="flex flex-col gap-2 justify-center items-center border bg-gray-800 border-gray-500 p-14 rounded-3xl shadow-lg">
          {/* Password Input */}
          <label htmlFor="password">Enter Admin Password</label>
          <input
            required
            type="password"
            name="password"
            className="border border-solid border-[#a1a1a1] text-black rounded-lg h-10 px-4"
            onChange={handleInputChange}
            value={adminPassword.password}
          />

          {/* Display error message if any */}
          {error && <div className="text-red-500">{error}</div>}

          {/* Submit Button */}
          <button
            className="mt-2 px-8 py-2 bg-green-700 hover:bg-green-900 rounded-lg"
            onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
