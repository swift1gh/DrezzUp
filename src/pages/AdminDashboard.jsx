import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import doneIcon from "../assets/done.svg";
import deleteIcon from "../assets/delete.svg";
import detailsIcon from "../assets/details.svg";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("new"); // Filter by 'new' or 'done'
  const [loading, setLoading] = useState(true); // To manage loading state

  // Real-time listener for orders data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const orderList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => {
          const dateA = parseDateString(a.date);
          const dateB = parseDateString(b.date);
          return dateB - dateA; // Latest date at the top
        });

      setOrders(orderList);
      setLoading(false); // Hide loading spinner once data is fetched
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Optimistic Update: Toggle between "done" and "new"
  const handleToggleStatus = async (orderId, currentStatus) => {
    // Optimistically update the UI before waiting for Firestore
    const newStatus = currentStatus === "done" ? "new" : "done";
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      // Update Firestore document
      const orderRef = doc(db, "customers", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Optimistic Delete: Remove from UI immediately
  const handleDelete = async (orderId) => {
    // Optimistically remove the order from the state
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    try {
      // Delete Firestore document
      const orderRef = doc(db, "customers", orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Helper function to parse the date string 'DD/MM/YYYY, HH:mm' to a Date object
  const parseDateString = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return new Date(); // Return current date if the string is invalid
    }

    const [datePart, timePart] = dateString.split(", ");
    if (!datePart || !timePart) {
      return new Date(); // Return current date if the format is incorrect
    }

    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  // Helper function to format timestamp to 'DD-MM-YYYY HH:mm'
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "Unknown Date";
    }
    const [datePart, timePart] = dateString.split(", ");
    if (!datePart || !timePart) {
      return "Invalid Date";
    }
    const [day, month, year] = datePart.split("/");
    return `${day}-${month}-${year} ${timePart}`;
  };

  // Filtered orders based on status (new or done)
  const filteredOrders = orders.filter((order) =>
    filter === "new" ? order.status !== "done" : order.status === "done"
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">COMBO ORDERS</h1>

      {/* Tabs for filtering orders */}
      <div className="mb-6">
        <button
          className={`mr-4 px-4 py-2 ${
            filter === "new" ? "bg-gray-800 text-white" : "bg-gray-300"
          }`}
          onClick={() => setFilter("new")}>
          New Orders
        </button>
        <button
          className={`px-4 py-2 ${
            filter === "done" ? "bg-gray-800 text-white" : "bg-gray-300"
          }`}
          onClick={() => setFilter("done")}>
          Done Orders
        </button>
      </div>

      {/* Loading spinner */}
      {loading && <p>Loading orders...</p>}

      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Contact</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Size</th>
                <th className="py-3 px-6 text-left">Guarantor's Name</th>
                <th className="py-3 px-6 text-left">Guarantor's Contact</th>
                <th className="py-3 px-6 text-left">Box</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="font-robotoCondensed font-light">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {formatDate(order.date)}
                  </td>
                  <td className="py-3 px-6 text-left">{order.fullName}</td>
                  <td className="py-3 px-6 text-left">{order.contact}</td>
                  <td className="py-3 px-6 text-left">{order.location}</td>
                  <td className="py-3 px-6 text-left">{order.size}</td>
                  <td className="py-3 px-6 text-left">{order.guarantorName}</td>
                  <td className="py-3 px-6 text-left">
                    {order.guarantorContact}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {order.addBox ? "Yes" : "No"}
                  </td>
                  <td className="px-6 text-left flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(order.id, order.status)}
                      className="hover:scale-110">
                      <img
                        src={order.status === "done" ? doneIcon : doneIcon} // Use appropriate icon
                        alt=""
                        className="h-7"
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="hover:scale-110">
                      <img src={deleteIcon} alt="" className="h-7 w-9" />
                    </button>

                    <button className="hover:scale-110">
                      <img src={detailsIcon} alt="" className="h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
