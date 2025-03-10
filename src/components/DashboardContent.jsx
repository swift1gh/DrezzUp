import React, { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { FaInbox } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const DashboardContent = ({
  isSidebarOpen,
  groupedOrders,
  fetchProducts,
  setSelectedOrder,
  handleStatusChange,
  handleDeleteOrder,
  loadingOrderId,
  filter,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setIsRefreshing(false);
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {filter === "new" ? "New Orders" : "Completed Orders"}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-[#BD815A] text-white px-4 py-2 rounded-lg hover:bg-[#a06b4a] transition-colors shadow-md">
            <FaSyncAlt className={`${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {Object.keys(groupedOrders).length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <FaInbox className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-xl text-gray-500">No {filter} orders found</p>
        </div>
      ) : (
        Object.keys(groupedOrders).map((dateKey) => (
          <div key={dateKey} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              {dateKey}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedOrders[dateKey].map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {order.fullName}
                        </h3>
                        <p className="text-sm text-gray-500 italic">
                          {order.contact}
                        </p>
                        <p className="text-sm text-gray-500 italic">
                          <span className="font-medium">Address:</span>{" "}
                          {order.location}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#BD815A] hover:text-[#a06b4a] transition-colors font-medium">
                        View Details
                      </button>
                      <div className="flex gap-2">
                        {filter === "new" ? (
                          <button
                            onClick={() => handleStatusChange(order.id, "done")}
                            disabled={loadingOrderId === order.id}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                            {loadingOrderId === order.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(order.id, "new")}
                            disabled={loadingOrderId === order.id}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                            {loadingOrderId === order.id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaUndo />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={loadingOrderId === order.id}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                          {loadingOrderId === order.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardContent;
