import React, { useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { GiCheckMark } from "react-icons/gi";
import { IoArrowUndoSharp } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";
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
    <div
      className={`${
        isSidebarOpen ? "w-full md:w-full" : "w-full md:w-[92%]"
      } p-5 overflow-y-auto`}>
      <div className="flex justify-between items-center mb-10 gap-5">
        <h1 className="text-xl md:text-xl lg:text-3xl font-bold text-gray-800">
          DREZZUP COMBO ORDERS
        </h1>

        {/* Refresh button */}
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{
            repeat: isRefreshing ? Infinity : 0,
            duration: 0.5, // Faster spin duration
            ease: "linear",
          }}
          className="cursor-pointer hover:rotate-180 transition-transform mr-5"
          onClick={handleRefresh}>
          <TfiReload size={20} />
        </motion.div>
      </div>

      {Object.keys(groupedOrders).length === 0 ? (
        <p className="text-gray-600">
          Loading...
          <br />
          <i>While you wait, check your internet connection and refresh</i>
        </p>
      ) : (
        Object.keys(groupedOrders).map((dateKey) => (
          <div key={dateKey}>
            <h2 className="text-lg font-bold bg-gray-300 p-2 rounded-t-lg">
              {dateKey}
            </h2>
            <div className="bg-white shadow-lg rounded-b-lg p-4 mb-5">
              {groupedOrders[dateKey].map((order) => (
                <div
                  key={order.id}
                  className="mb-6 last:mb-0 flex flex-col md:flex-row gap-4">
                  <ul className="w-full">
                    <li
                      className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition flex flex-col md:flex-row gap-5 justify-between items-center"
                      onClick={() => setSelectedOrder(order)}>
                      <div>
                        <p>
                          <strong>Name:</strong> {order.fullName}
                        </p>
                        <p>
                          <strong>Contact:</strong> {order.contact}
                        </p>
                        <p>
                          <strong>Location:</strong> {order.location}
                        </p>
                      </div>

                      <div className="flex md:justify-center items-center gap-2">
                        {filter === "new" && (
                          <button
                            className="bg-green-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, "done");
                            }}>
                            {loadingOrderId === order.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.5, // Faster spin duration
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <GiCheckMark /> Done
                              </>
                            )}
                          </button>
                        )}

                        {filter === "done" && (
                          <button
                            className="bg-blue-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(order.id, "new");
                            }}>
                            {loadingOrderId === order.id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.5, // Faster spin duration
                                  ease: "linear",
                                }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <IoArrowUndoSharp /> Undo
                              </>
                            )}
                          </button>
                        )}

                        <button
                          className="bg-red-600 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(order.id);
                          }}>
                          {loadingOrderId === order.id ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.5, // Faster spin duration
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                          ) : (
                            <>
                              <BsFillTrash3Fill /> Delete
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  </ul>
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
