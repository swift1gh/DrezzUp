import React from "react";
import Product from "./Product";

const OrderDetails = ({ selectedOrder, setSelectedOrder, products }) => {
  return (
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
              <td className="font-semibold text-gray-800">Number of Boxes:</td>
              <td>{selectedOrder.addBox}</td>
            </tr>
            <tr>
              <td className="font-semibold text-gray-800">Guarantor's Name:</td>
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
  );
};

export default OrderDetails;
