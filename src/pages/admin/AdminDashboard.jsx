import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { TfiReload } from "react-icons/tfi";
import Product from "../../components/Product";
import { GiCheckMark } from "react-icons/gi";
import { BsFillTrash3Fill } from "react-icons/bs";
import { IoArrowUndoSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaCheckDouble,
  FaCloudUploadAlt,
  FaFileAlt,
} from "react-icons/fa";
import { motion } from "motion/react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      console.log("Fetching orders...");
      const querySnapshot = await getDocs(collection(db, "customers"));
      if (querySnapshot.empty) {
        console.warn("No documents found in Firestore.");
      }
      const orderList = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          status: doc.data().status || "new",
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("Fetched Orders:", orderList);
      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      const querySnapshot = await getDocs(collection(db, "products"));
      if (querySnapshot.empty) {
        console.warn("No products found in Firestore.");
      }
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Products:", productList);
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = doc(db, "customers", orderId);
      await updateDoc(orderRef, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setLoadingOrderId(orderId);
      try {
        const orderRef = doc(db, "customers", orderId);
        await deleteDoc(orderRef);
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
      } finally {
        setLoadingOrderId(null);
      }
    }
  };

  const filteredOrders = orders.filter((order) =>
    filter === "new" ? order.status === "new" : order.status === "done"
  );

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date = new Date(
      order.date.split(",")[0].split("/").reverse().join("-")
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(order);
    return acc;
  }, {});

  //Handle Open And Close Sidebar
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-1/4" : "w-1/5 md:w-[8%] md:min-w-[8%]"
        } bg-gray-900 text-white p-2 md:p-5 shadow-lg`}>
        <div className="items-center mb-5 py-5">
          {isSidebarOpen ? (
            <FaAngleDoubleLeft
              className="size-7 cursor-pointer"
              onClick={handleToggleSidebar}
            />
          ) : (
            <FaAngleDoubleRight
              className="size-7 cursor-pointer"
              onClick={handleToggleSidebar}
            />
          )}
        </div>

        {/* New Orders Button */}
        <button
          className={`w-full p-3 mb-2 rounded-2xl transition flex items-center justify-center gap-2 ${
            filter === "new"
              ? "bg-white text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("new")}>
          <FaFileAlt className="flex justify-center text-center my-auto " />
          {isSidebarOpen && <span>New</span>}
        </button>

        {/* Done Orders Button */}
        <button
          className={`w-full p-3 rounded-2xl transition flex items-center justify-center  gap-2 ${
            filter === "done"
              ? "bg-white text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("done")}>
          <FaCheckDouble className="flex justify-center text-center my-auto" />
          {isSidebarOpen && <span>Done</span>}
        </button>

        {/* Add New Product Button */}
        <Link to="/admin/productupload">
          <button className="w-full p-3 mt-5 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition flex items-center justify-center gap-2">
            <FaCloudUploadAlt className="flex justify-center text-center my-auto" />

            {isSidebarOpen && <span>Add New Product</span>}
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? "w-full" : "w-full md:w-[92%]"
        } p-5 overflow-y-auto`}>
        <div className="flex justify-between items-center mb-10 gap-5">
          <h1 className="text-xl md:text-xl lg:text-3xl font-bold text-gray-800">
            DREZZUP COMBO ORDERS
          </h1>

          {/* Refresh button */}
          <TfiReload
            size={20}
            className="cursor-pointer hover:rotate-180 transition-transform mr-5 size-auto"
            onClick={() => {
              fetchOrders();
              fetchProducts();
            }}
          />
        </div>

        {Object.keys(groupedOrders).length === 0 ? (
          <p className="text-gray-600">
            Loading...
            <br />
            <i>While you wait, check your internet connection and refresh</i>
          </p>
        ) : (
          Object.keys(groupedOrders).map((date) => (
            <div key={date}>
              <h2 className="text-lg font-bold bg-gray-300 p-2 rounded-t-lg">
                {date}
              </h2>
              <div className="bg-white shadow-lg rounded-b-lg p-4 mb-5">
                {groupedOrders[date].map((order) => (
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
                                    duration: 1,
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
                                    duration: 1,
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
                                  duration: 1,
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto py-10"
          onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white p-6 rounded-lg shadow-lg text-center w-auto mt-10"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <table className="w-full mb-4 text-left">
              <tbody>
                <tr>
                  <td className="font-semibold text-gray-800">Name:</td>
                  <td>{selectedOrder.fullName}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">Contact:</td>
                  <td>{selectedOrder.contact}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">Location:</td>
                  <td>{selectedOrder.location}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">Box:</td>
                  <td>{selectedOrder.addBox ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">
                    Guarantor's Name:
                  </td>
                  <td>{selectedOrder.guarantorName}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">
                    Guarantor's Contact:
                  </td>
                  <td>{selectedOrder.guarantorContact}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">Shoe Size:</td>
                  <td>{selectedOrder.size}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-gray-800">Combo Price:</td>
                  <td>GHS {selectedOrder.comboPrice}.00</td>
                </tr>
              </tbody>
            </table>
            <h3 className="text-lg font-bold mt-4">Selected Products</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {products
                .filter((product) =>
                  selectedOrder.selectedIds.includes(product.id.toString())
                )
                .map((product) => (
                  <Product
                    key={product.id}
                    Image={product.image}
                    Name={product.name}
                    Color={product.color}
                  />
                ))}
            </div>
            <button
              className="mt-5 w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
