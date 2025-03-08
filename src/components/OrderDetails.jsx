import React from "react";
import Product from "./Product";

const OrderDetails = ({ selectedOrder, setSelectedOrder, products }) => {
  if (!selectedOrder) return null;

  const total = selectedOrder.comboPrice + selectedOrder.addBox * 20;

  return (
    <div
      // Full-screen backdrop
      className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-hidden"
      onClick={() => setSelectedOrder(null)}>
      {/* Center the modal horizontally; start near the top */}
      <div
        className="flex items-start justify-center min-h-screen"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Actual modal container */}
        <div
          className="
            relative
            bg-white
            p-6
            m-4
            rounded-lg
            shadow-lg
            max-w-md
            w-full
            overflow-y-auto
            max-h-[calc(100vh-2rem)]
            modal-content
          ">
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
                <td className="font-semibold text-gray-800">
                  Number of Boxes:
                </td>
                <td>{selectedOrder.addBox}</td>
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
              <hr className="mt-5" />
              <tr>
                <td className="font-semibold text-gray-800 font-roboto">
                  TOTAL:
                </td>
                <td className="font-semibold text-gray-800 font-roboto">
                  GHS {total}.00
                </td>
              </tr>
              <hr />
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

          <div className="pt-6">
            <button
              className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
