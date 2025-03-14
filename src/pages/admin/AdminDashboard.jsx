import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Link } from "react-router-dom";
import {
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaCheckDouble,
  FaCloudUploadAlt,
  FaFileAlt,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";
import OrderDetails from "../../components/OrderDetails";
import DashboardContent from "../../components/dashboard/DashboardContent";
import bgImage from "../../assets/7.jpg";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  // Listen to Firestore orders
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      console.log(
        "Raw Firestore data:",
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      const orderList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          // Convert Firestore Timestamp to Date; if not available, default to now
          const dateObj = data.date?.toDate
            ? data.date.toDate()
            : new Date(data.date || Date.now());

          const order = {
            id: doc.id,
            ...data,
            status: data.status || "new", // Ensure status is set
            date: dateObj,
            dateString: !isNaN(dateObj)
              ? dateObj.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Invalid Date",
          };
          console.log("Processed order:", order);
          return order;
        })
        .sort((a, b) => b.date - a.date);

      console.log("Final processed orders:", orderList);
      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

  // Auto toggle sidebar based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch products from Firestore
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
    fetchProducts();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = doc(db, "customers", orderId);
      await updateDoc(orderRef, { status: newStatus });
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
      } catch (error) {
        console.error("Error deleting order:", error);
      } finally {
        setLoadingOrderId(null);
      }
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (!order || !order.status) {
      console.warn("Invalid order or missing status:", order);
      return false;
    }
    console.log(
      `Filtering order ${order.id}: status=${order.status}, filter=${filter}`
    );

    switch (filter) {
      case "new":
        return order.status === "new";
      case "paid":
        return order.status === "paid";
      case "done":
        return order.status === "done";
      default:
        return order.status === "new";
    }
  });

  // Group orders by their formatted date string
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!order.dateString) {
      console.warn("Order missing dateString:", order);
      return acc;
    }
    const key = order.dateString;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(order);
    return acc;
  }, {});

  console.log("Current filter:", filter);
  console.log("Filtered orders:", filteredOrders);
  console.log("Grouped orders:", groupedOrders);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarButtonClick = (newFilter) => {
    setFilter(newFilter);
    // Close sidebar on mobile devices
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>
      {/* Sidebar with glass effect */}
      <div
        className={`backdrop-blur-md bg-[#1a202c]/90 text-white transition-all duration-300 ease-in-out h-screen ${
          isSidebarOpen ? "w-64" : "w-20"
        } flex flex-col flex-shrink-0 border-r border-gray-700/30`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700/30">
          {isSidebarOpen && (
            <div className="font-sans font-semibold text-[20px]">
              <span className="text-white bg-black px-1 py-0.5 rounded-sm">
                DREZZ
              </span>
              <span className="text-[#BD815A] font-bold">UP</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            {isSidebarOpen ? (
              <FaAngleDoubleLeft size={20} />
            ) : (
              <FaAngleDoubleRight size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Top */}
          <div>
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
                setFilter("new");
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
                filter === "new" ? "bg-gray-700" : ""
              }`}>
              {isSidebarOpen ? (
                <>
                  <FaFileAlt size={24} className="text-[#BD815A]" />
                  <span>New</span>
                </>
              ) : (
                <FaFileAlt size={24} className="mx-auto text-[#BD815A]" />
              )}
            </button>

            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
                setFilter("paid");
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
                filter === "paid" ? "bg-gray-700" : ""
              }`}>
              {isSidebarOpen ? (
                <>
                  <FaMoneyBillWave size={24} className="text-[#BD815A]" />
                  <span>Paid</span>
                </>
              ) : (
                <FaMoneyBillWave size={24} className="mx-auto text-[#BD815A]" />
              )}
            </button>

            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
                setFilter("done");
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
                filter === "done" ? "bg-gray-700" : ""
              }`}>
              {isSidebarOpen ? (
                <>
                  <FaCheckDouble size={24} className="text-[#BD815A]" />
                  <span>Done</span>
                </>
              ) : (
                <FaCheckDouble size={24} className="mx-auto text-[#BD815A]" />
              )}
            </button>
          </div>

          {/* Bottom */}
          <div className="mt-auto mb-2 fixed bottom-0">
            <a
              href="/admin/product-upload"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                filter === "upload" ? "bg-gray-700" : ""
              }`}>
              {isSidebarOpen ? (
                <>
                  <FaCloudUploadAlt size={24} className="text-[#BD815A]" />
                  <span>Products</span>
                </>
              ) : (
                <FaCloudUploadAlt
                  size={24}
                  className="mx-auto text-[#BD815A]"
                />
              )}
            </a>

            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
                setFilter("summary");
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
                filter === "summary" ? "bg-gray-700" : ""
              }`}>
              {isSidebarOpen ? (
                <>
                  <FaChartLine size={24} className="text-[#BD815A]" />
                  <span>Summary</span>
                </>
              ) : (
                <FaChartLine size={24} className="mx-auto text-[#BD815A]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <DashboardContent
          isSidebarOpen={isSidebarOpen}
          groupedOrders={groupedOrders}
          fetchProducts={fetchProducts}
          setSelectedOrder={setSelectedOrder}
          handleStatusChange={handleStatusChange}
          handleDeleteOrder={handleDeleteOrder}
          loadingOrderId={loadingOrderId}
          filter={filter}
        />
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <OrderDetails
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          products={products}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
