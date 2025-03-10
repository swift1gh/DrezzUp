import React from "react";
import Product from "./Product";

const OrderDetails = ({ selectedOrder, setSelectedOrder, products }) => {
  if (!selectedOrder) return null;

  const total = selectedOrder.comboPrice + selectedOrder.addBox * 20;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-200 rounded-xl shadow-xl w-[90%] max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1a202c] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-white hover:text-gray-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Customer Info */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedOrder.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{selectedOrder.contact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedOrder.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Number of Boxes</p>
                <p className="font-medium">{selectedOrder.addBox}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guarantor's Name</p>
                <p className="font-medium">{selectedOrder.guarantorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guarantor's Contact</p>
                <p className="font-medium">{selectedOrder.guarantorContact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shoe Size</p>
                <p className="font-medium">{selectedOrder.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    selectedOrder.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Products */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Selected Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
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
          </div>

          {/* Total */}
          <div className="md:mt-6 mt-4 py-3 border-t border-gray-200 bg-white px-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 uppercase font-bold ">
                Total
              </h3>
              <p className="text-xl font-semibold text-[#BD815A]">
                GHS {total}.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
