import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/7.jpg";

const AdminLogin = () => {
  const [email] = useState("drezzup@gmail.com");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set the login timestamp in local storage
      localStorage.setItem("loginTimestamp", new Date().getTime());
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}>
      <div className="bg-white shadow-xl rounded-xl p-8 w-96 backdrop-blur-sm bg-opacity-95 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="font-sans font-semibold text-[28px] mb-2">
            <span className="text-white bg-black px-1 py-0.5 rounded-sm">DREZZ</span>
            <span className="text-[#BD815A] font-bold">UP</span>
          </h1>
          <h2 className="text-xl font-medium text-gray-700">Admin Login</h2>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-gray-300 p-3 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-[#BD815A] text-white font-medium p-3 rounded-lg hover:bg-[#a06b4a] transition-colors duration-200 shadow-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
