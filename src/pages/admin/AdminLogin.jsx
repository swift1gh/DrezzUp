import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email] = useState("drezzup@gmail.com");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Admin Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="password"
            placeholder="Enter Password"
            className="border border-gray-300 p-3 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-medium p-3 rounded-md hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
