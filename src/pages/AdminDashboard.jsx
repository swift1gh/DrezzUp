import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const response = await getDocs(collection(db, "customers"));
    const userList = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  return <div>AdminDashboard</div>;
};

export default AdminDashboard;
