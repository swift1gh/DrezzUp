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
} from "react-icons/fa";
import OrderDetails from "../../components/OrderDetails";
import DashboardContent from "../../components/DashboardContent";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const orderList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            status: data.status || "new",
            date:
              data.date instanceof Date
                ? data.date
                : data.date?.toDate?.() || new Date(data.date || Date.now()),
          };
        })
        .sort((a, b) => b.date - a.date);

      setOrders(orderList);
    });

    return () => unsubscribe();
  }, []);

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

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const filteredOrders = orders.filter((order) =>
    filter === "new" ? order.status === "new" : order.status === "done"
  );

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const date =
      order.date instanceof Date
        ? order.date
        : order.date?.toDate?.() || new Date(order.date);

    const formattedDate =
      order.date instanceof Date
        ? order.date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Invalid Date";

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(order);
    return acc;
  }, {});

  // Sort orders within each date group by time (latest first)
  Object.keys(groupedOrders).forEach((date) => {
    groupedOrders[date].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeB - timeA;
    });
  });

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarButtonClick = (newFilter) => {
    setFilter(newFilter);

    // Close sidebar by default only on mobile
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen
            ? "w-3/5 md:w-1/4 absolute h-screen md:relative z-10"
            : "w-1/5 md:w-[8%] md:min-w-[8%]"
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
          onClick={() => handleSidebarButtonClick("new")}>
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
          onClick={() => handleSidebarButtonClick("done")}>
          <FaCheckDouble className="flex justify-center text-center my-auto" />
          {isSidebarOpen && <span>Done</span>}
        </button>

        {/* Add New Product Button */}
        <Link to="/admin/productupload">
          <button
            className="w-full p-3 mt-5 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition flex items-center justify-center gap-2"
            onClick={handleToggleSidebar}>
            <FaCloudUploadAlt className="flex justify-center text-center my-auto" />
            {isSidebarOpen && <span>Products</span>}
          </button>
        </Link>
      </div>

      {/* Main Content */}
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

      {/* Order Details Modal */}
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
