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
import someOtherIcon from "../assets/new.svg"; // Icon for 'new' status

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("new"); // Filter by 'new' or 'done'
  const [loading, setLoading] = useState(true); // To manage loading state
  const [selectedOrder, setSelectedOrder] = useState(null); // Selected order for modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state

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
    const newStatus = currentStatus === "done" ? "new" : "done";
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);

    try {
      const orderRef = doc(db, "customers", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Optimistic Delete: Remove from UI immediately
  const handleDelete = async (orderId) => {
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);

    try {
      const orderRef = doc(db, "customers", orderId);
      await deleteDoc(orderRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  // Open modal to show order details
  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
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
                  <td className="px-1 text-left flex justify-center items-center gap-2 h-full">
                    <button
                      onClick={() => handleToggleStatus(order.id, order.status)}
                      className="hover:scale-110">
                      <img
                        src={order.status === "done" ? doneIcon : someOtherIcon}
                        alt=""
                        className="h-7"
                      />
                    </button>

                    <button
                      onClick={() => handleDelete(order.id)}
                      className="hover:scale-110">
                      <img src={deleteIcon} alt="" className="h-7 w-9" />
                    </button>

                    <button
                      onClick={() => handleShowDetails(order)}
                      className="hover:scale-110">
                      <img src={detailsIcon} alt="" className="h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for order details */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Date:</strong> {formatDate(selectedOrder.date)}
            </p>
            <p>
              <strong>Name:</strong> {selectedOrder.fullName}
            </p>
            <p>
              <strong>Contact:</strong> {selectedOrder.contact}
            </p>
            <p>
              <strong>Location:</strong> {selectedOrder.location}
            </p>
            <p>
              <strong>Size:</strong> {selectedOrder.size}
            </p>
            <p>
              <strong>Guarantor's Name:</strong> {selectedOrder.guarantorName}
            </p>
            <p>
              <strong>Guarantor's Contact:</strong>{" "}
              {selectedOrder.guarantorContact}
            </p>
            <p>
              <strong>Box Added:</strong> {selectedOrder.addBox ? "Yes" : "No"}
            </p>
            <p>
              <strong>Products:</strong>
            </p>
            <ul className="list-disc ml-6">
              {selectedOrder.products &&
                selectedOrder.products.map((product, index) => (
                  <li key={index}>
                    {product.name} - {product.color} ({product.price})
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
