import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { TfiReload } from "react-icons/tfi";
import Product from "../../components/Product";
import { GiCheckMark } from "react-icons/gi";
import { BsFillTrash3Fill } from "react-icons/bs";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-5 shadow-lg">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Orders</h2>
          <TfiReload
            size={20}
            className="cursor-pointer hover:rotate-180 transition-transform"
            onClick={() => {
              fetchOrders();
              fetchProducts();
            }}
          />
        </div>
        <button
          className={`w-full p-3 mb-2 rounded-lg transition ${
            filter === "new"
              ? "bg-white text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("new")}>
          New
        </button>
        <button
          className={`w-full p-3 rounded-lg transition ${
            filter === "done"
              ? "bg-white text-black"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setFilter("done")}>
          Done
        </button>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-5 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-10 text-gray-800">
          DREZZUP COMBO ORDERS
        </h1>
        {Object.keys(groupedOrders).length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          Object.keys(groupedOrders).map((date) => (
            <div key={date}>
              <h2 className="text-lg font-bold bg-gray-300 p-2 rounded-t-lg">
                {date}
              </h2>
              <div className="bg-white shadow-lg rounded-b-lg p-4 mb-5">
                {groupedOrders[date].map((order) => (
                  <div key={order.id} className="mb-6 last:mb-0 flex">
                    <ul className="w-8/12">
                      <li
                        className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition"
                        onClick={() => setSelectedOrder(order)}>
                        <p>
                          <strong>Name:</strong> {order.fullName}
                        </p>
                        <p>
                          <strong>Contact:</strong> {order.contact}
                        </p>
                        <p>
                          <strong>Location:</strong> {order.location}
                        </p>
                      </li>
                    </ul>

                    <div className="w-4/12 flex justify-center items-center gap-2">
                      <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition flex items-center gap-1">
                        <GiCheckMark /> Done
                      </button>

                      <button className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-800 transition flex items-center gap-1">
                        <BsFillTrash3Fill /> Delete
                      </button>
                    </div>
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
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setSelectedOrder(null)}>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-3 text-gray-800">
              Order Details
            </h2>
            <table className="w-full mb-4">
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
                .filter((product) => {
                  const isSelected = selectedOrder.selectedIds.includes(
                    product.id.toString()
                  );
                  console.log(
                    `Product ID: ${product.id}, Is Selected: ${isSelected}`
                  );
                  return isSelected;
                })
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
