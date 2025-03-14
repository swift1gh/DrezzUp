import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  FaInbox,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatisticsSection = ({ groupedOrders }) => {
  if (!groupedOrders || Object.keys(groupedOrders).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fadeIn">
        <FaInbox className="text-gray-400 text-6xl mx-auto mb-4" />
        <p className="text-xl text-gray-500">No data available for summary</p>
      </div>
    );
  }

  const stats = useMemo(() => {
    const calculatedStats = {
      totalRevenue: 0,
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      popularProducts: {},
      locations: {},
      monthlyRevenue: {},
      averageOrderValue: 0,
      ordersByStatus: {
        new: 0,
        paid: 0,
        done: 0,
      },
    };

    // Initialize monthly revenue for all months
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(i);
      return date.toLocaleString("default", { month: "short" });
    });
    months.forEach((month) => {
      calculatedStats.monthlyRevenue[month] = 0;
    });

    Object.entries(groupedOrders).forEach(([date, orders]) => {
      const orderMonth = new Date(date).toLocaleString("default", {
        month: "short",
      });

      orders?.forEach((order) => {
        if (!order) return;

        // Debug log for order data
        console.log("Processing order:", {
          id: order.id,
          status: order.status,
          comboPrice: order.comboPrice,
          addBox: order.addBox,
          total: order.TOTAL,
        });

        // Basic stats
        calculatedStats.totalOrders++;

        // Calculate total from order
        let orderTotal = 0;
        if (order.TOTAL) {
          orderTotal = parseFloat(order.TOTAL);
        } else if (order.comboPrice) {
          orderTotal =
            parseFloat(order.comboPrice) + parseInt(order.addBox || 0) * 20;
        }

        // Debug log for calculated total
        console.log("Calculated order total:", {
          orderId: order.id,
          total: orderTotal,
          TOTAL: order.TOTAL,
          comboPrice: order.comboPrice,
          addBox: order.addBox,
        });

        // Order status counting and revenue calculation
        switch (order.status) {
          case "new":
            calculatedStats.ordersByStatus.new++;
            calculatedStats.pendingOrders++;
            break;
          case "paid":
            calculatedStats.ordersByStatus.paid++;
            calculatedStats.totalRevenue += orderTotal;
            calculatedStats.monthlyRevenue[orderMonth] += orderTotal;
            break;
          case "done":
            calculatedStats.ordersByStatus.done++;
            calculatedStats.completedOrders++;
            calculatedStats.totalRevenue += orderTotal;
            calculatedStats.monthlyRevenue[orderMonth] += orderTotal;
            break;
        }

        // Debug log for running totals
        console.log("Running totals:", {
          orderId: order.id,
          totalRevenue: calculatedStats.totalRevenue,
          status: order.status,
          monthlyRevenue: calculatedStats.monthlyRevenue[orderMonth],
          orderTotal: orderTotal,
        });

        // Products tracking
        if (order.selectedIds && Array.isArray(order.selectedIds)) {
          order.selectedIds.forEach((productId) => {
            const productName = `Product ${productId}`; // You might want to fetch actual product names
            calculatedStats.popularProducts[productName] = {
              count:
                (calculatedStats.popularProducts[productName]?.count || 0) + 1,
              revenue:
                (calculatedStats.popularProducts[productName]?.revenue || 0) +
                orderTotal / order.selectedIds.length, // Distribute revenue equally among products
            };
          });
        }

        // Locations tracking
        if (order.location) {
          calculatedStats.locations[order.location] = {
            count: (calculatedStats.locations[order.location]?.count || 0) + 1,
            revenue:
              (calculatedStats.locations[order.location]?.revenue || 0) +
              orderTotal,
          };
        }
      });
    });

    // Calculate average order value (from paid and completed orders)
    const paidAndCompletedOrders =
      calculatedStats.ordersByStatus.paid + calculatedStats.ordersByStatus.done;
    calculatedStats.averageOrderValue =
      paidAndCompletedOrders > 0
        ? calculatedStats.totalRevenue / paidAndCompletedOrders
        : 0;

    // Debug log for final stats
    console.log("Final calculated stats:", calculatedStats);

    return calculatedStats;
  }, [groupedOrders]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          generateLabels: (chart) => {
            const labels = ["New Orders", "Ready for Delivery", "Completed"];
            const colors = [
              "rgba(234, 179, 8, 0.8)", // Warning yellow for new
              "rgba(59, 130, 246, 0.8)", // Blue for paid/ready
              "rgba(34, 197, 94, 0.8)", // Success green for done
            ];
            return labels.map((label, i) => ({
              text: label,
              fillStyle: colors[i],
              strokeStyle: colors[i],
              index: i,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const labels = ["New Orders", "Ready for Delivery", "Completed"];
            const total = Object.values(stats.ordersByStatus).reduce(
              (a, b) => a + b,
              0
            );
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${labels[context.dataIndex]}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const revenueData = {
    labels: Object.keys(stats.monthlyRevenue),
    datasets: [
      {
        label: "Monthly Revenue",
        data: Object.values(stats.monthlyRevenue),
        backgroundColor: "rgba(129, 140, 248, 0.2)",
        borderColor: "rgb(129, 140, 248)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const orderStatusData = {
    labels: ["New", "Ready for Delivery", "Completed"],
    datasets: [
      {
        data: [
          stats.ordersByStatus.new,
          stats.ordersByStatus.paid,
          stats.ordersByStatus.done,
        ],
        backgroundColor: [
          "rgba(234, 179, 8, 0.8)", // Warning yellow for new
          "rgba(59, 130, 246, 0.8)", // Blue for paid/ready
          "rgba(34, 197, 94, 0.8)", // Success green for done
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6 p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">
                GHS{" "}
                {stats.totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FaDollarSign className="text-2xl text-indigo-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Avg. Order: GHS{" "}
            {stats.averageOrderValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FaShoppingCart className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Completed: {stats.completedOrders} (
            {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%)
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.pendingOrders}
              </h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FaCalendarAlt className="text-2xl text-yellow-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Pending Rate:{" "}
            {((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Locations</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {Object.keys(stats.locations).length}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FaMapMarkerAlt className="text-2xl text-red-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Most active:{" "}
            {
              Object.entries(stats.locations).sort(
                (a, b) => b[1].count - a[1].count
              )[0]?.[0]
            }
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
          <div className="h-[300px]">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6">
            Order Status Distribution
          </h2>
          <div className="h-[300px]">
            <Doughnut data={orderStatusData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <div className="space-y-4">
            {Object.entries(stats.popularProducts)
              .sort((a, b) => b[1].revenue - a[1].revenue)
              .slice(0, 5)
              .map(([product, data]) => (
                <div
                  key={product}
                  className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaBoxOpen className="text-gray-400" />
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-gray-500">
                        {data.count} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      GHS {data.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((data.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                      of revenue
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Top Locations</h2>
          <div className="space-y-4">
            {Object.entries(stats.locations)
              .sort((a, b) => b[1].revenue - a[1].revenue)
              .slice(0, 5)
              .map(([location, data]) => (
                <div
                  key={location}
                  className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <div>
                      <p className="font-medium">{location}</p>
                      <p className="text-sm text-gray-500">
                        {data.count} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      GHS {data.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((data.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                      of revenue
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

StatisticsSection.propTypes = {
  groupedOrders: PropTypes.object.isRequired,
};

export default StatisticsSection;
