import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import StatisticsSection from "./StatisticsSection";
import OrderCard from "./OrderCard";
import RefreshButton from "./RefreshButton";
import NoDataPlaceholder from "./NoDataPlaceholder";

const DashboardContent = ({
  groupedOrders,
  fetchProducts,
  setSelectedOrder,
  handleStatusChange,
  handleDeleteOrder,
  loadingOrderId,
  filter,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset error when filter changes
    setError(null);
  }, [filter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await fetchProducts();
    } catch (err) {
      console.error("Error refreshing products:", err);
      setError("Failed to refresh products. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 h-full p-3 sm:p-6 overflow-y-auto">
        <div className="backdrop-blur-md bg-red-50/90 rounded-2xl p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (filter === "summary") {
      return <StatisticsSection groupedOrders={groupedOrders} />;
    }

    if (!groupedOrders || Object.keys(groupedOrders).length === 0) {
      return (
        <div className="backdrop-blur-md bg-white/80 rounded-2xl p-8">
          <NoDataPlaceholder message={`No ${filter} orders found`} />
        </div>
      );
    }

    return Object.entries(groupedOrders)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([dateKey, orders]) => (
        <div
          key={dateKey}
          className="mb-8 backdrop-blur-md bg-white/80 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {dateKey}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                setSelectedOrder={setSelectedOrder}
                loadingOrderId={loadingOrderId}
                handleStatusChange={handleStatusChange}
                handleDeleteOrder={handleDeleteOrder}
              />
            ))}
          </div>
        </div>
      ));
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-6 overflow-y-auto">
      <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {filter === "new"
              ? "New Orders"
              : filter === "paid"
              ? "Paid Orders"
              : filter === "done"
              ? "Completed Orders"
              : "Combo Summary"}
          </h1>
          <RefreshButton
            isRefreshing={isRefreshing}
            handleRefresh={handleRefresh}
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

DashboardContent.propTypes = {
  isSidebarOpen: PropTypes.bool,
  groupedOrders: PropTypes.object.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setSelectedOrder: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
  loadingOrderId: PropTypes.string,
  filter: PropTypes.string.isRequired,
};

export default DashboardContent;
