import React, { useState, useEffect } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  DollarSign,
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Lock,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { adminAPI } from "../services/api";
import Orders from "./Orders";
import { Order, Product, User } from "../types";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  thisMonthOrders: number;
  thisMonthRevenue: number;
  orderGrowth: number;
  lowStockCount: number;
  pendingOrders: number;
}

interface SalesData {
  date: string;
  sales: number;
}

interface CategorySales {
  category: string;
  sales: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [salesChart, setSalesChart] = useState<SalesData[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardData();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllEvents();
      setEvents(response.data.content || response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAddresses();
      setAddresses(response.data.content || response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes, categoryRes, ordersRes, productsRes] =
        await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getSalesChart(30),
          adminAPI.getCategorySales(),
          adminAPI.getRecentOrders(),
          adminAPI.getTopProducts(),
        ]);

      setDashboardStats(statsRes.data);
      setSalesChart(salesRes.data);
      setCategorySales(categoryRes.data);
      setRecentOrders(ordersRes.data);
      setTopProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.content);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProducts();
      setProducts(response.data.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders();
      setOrders(response.data.content);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: number, enabled: boolean) => {
    try {
      await adminAPI.updateUserStatus(userId, enabled);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const updateProductStock = async (productId: number, stock: number) => {
    try {
      await adminAPI.updateProductStock(productId, stock);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Access Denied
          </h1>
          <p className="text-text-secondary">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading && activeTab === "dashboard") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-text-primary"></div>
      </div>
    );
  }
  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-text-primary">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-light-gray rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-light-gray mb-8 bg-white rounded-lg shadow-sm">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "dashboard", name: "Dashboard", icon: BarChart3 },
              { id: "analytics", name: "Analytics", icon: PieChart },
              { id: "orders", name: "Orders", icon: ShoppingCart },
              { id: "products", name: "Products", icon: Package },
              { id: "users", name: "Users", icon: Users },
              { id: "events", name: "Events", icon: Calendar },
              { id: "addresses", name: "Addresses", icon: MapPin },
              { id: "inventory", name: "Inventory", icon: AlertTriangle },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-text-primary text-text-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && dashboardStats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      ${dashboardStats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  +{dashboardStats.orderGrowth}% from last month
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {dashboardStats.totalOrders}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  {dashboardStats.thisMonthOrders} this month
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {dashboardStats.totalProducts}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm text-orange-600 mt-2">
                  {dashboardStats.lowStockCount} low stock
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-text-primary">
                      {dashboardStats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-2">
                  {dashboardStats.pendingOrders} pending orders
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sales Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Sales Trend (Last 30 Days)
                </h3>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {salesChart.slice(-7).map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className="bg-text-primary rounded-t w-full"
                        style={{
                          height: `${Math.max(
                            (data.sales /
                              Math.max(...salesChart.map((d) => d.sales))) *
                              200,
                            4
                          )}px`,
                        }}
                      ></div>
                      <span className="text-xs text-text-secondary mt-2">
                        {new Date(data.date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Sales */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Sales by Category
                </h3>
                <div className="space-y-4">
                  {categorySales.slice(0, 4).map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-text-primary font-medium">
                        {category.category}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-light-gray rounded-full h-2">
                          <div
                            className="bg-text-primary h-2 rounded-full"
                            style={{
                              width: `${
                                (category.sales /
                                  Math.max(
                                    ...categorySales.map((c) => c.sales)
                                  )) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-text-secondary text-sm">
                          ${category.sales.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-text-primary">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-primary">
                          ${order.totalAmount}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.status === "SHIPPED"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "CONFIRMED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-light-gray">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Top Selling Products
                </h3>
                <div className="space-y-4">
                  {topProducts.slice(0, 5).map((product: any, index) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-text-primary">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-text-primary">
                            {product.productName}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {product.quantitySold} sold
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-text-primary">
                        ${product.revenue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-primary">
                User Management
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-light-gray">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-gray bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id} className="border-b border-light-gray">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-text-primary rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.enabled
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateUserStatus(user.id, !user.enabled)
                              }
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                user.enabled
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                            >
                              {user.enabled ? "Disable" : "Enable"}
                            </button>
                            <button className="p-1 text-text-light hover:text-text-primary">
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-primary">
                Product Management
              </h2>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-light-gray">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-gray bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Product
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Stock
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <tr
                        key={product.id}
                        className="border-b border-light-gray"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.imageUrls?.[0] || "/placeholder.jpg"}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-text-primary">
                                {product.name}
                              </p>
                              <p className="text-sm text-text-secondary">
                                SKU: JW-{product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-secondary capitalize">
                          {product.category?.name}
                        </td>
                        <td className="py-3 px-4 text-text-primary">
                          ${product.price}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={product.stockQuantity}
                            onChange={(e) =>
                              updateProductStock(
                                product.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20 px-2 py-1 border border-light-gray rounded text-sm"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-text-light hover:text-text-primary">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-text-light hover:text-text-primary">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-text-light hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-primary">
                Order Management
              </h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent">
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button className="flex items-center space-x-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-light-gray">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-gray bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order: any) => (
                      <tr key={order.id} className="border-b border-light-gray">
                        <td className="py-3 px-4 font-medium text-text-primary">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="py-3 px-4 text-text-primary font-medium">
                          ${order.totalAmount}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "DELIVERED"
                                ? "bg-green-100 text-green-800"
                                : order.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "CONFIRMED"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "PENDING"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.paymentStatus === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : order.paymentStatus === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-text-light hover:text-text-primary">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-text-light hover:text-text-primary">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-light-gray">
                <h2 className="text-xl font-semibold text-text-primary">
                  Change Password
                </h2>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-text-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-text-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-light-gray rounded-md focus:ring-2 focus:ring-text-primary focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 bg-text-primary text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 border border-light-gray text-text-primary py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-primary">
                Event Management
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-light-gray">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-light-gray bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Event Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">
                        Location
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-text-secondary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length > 0 ? (
                      events.map((event: any) => (
                        <tr key={event.id} className="border-b border-light-gray hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-medium text-text-primary">{event.title}</p>
                            <p className="text-sm text-text-secondary line-clamp-1">{event.description}</p>
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {event.location}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button className="p-1 text-text-primary hover:bg-light-gray rounded transition-colors mr-2">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-text-secondary">
                          No events found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-text-primary">
                Address Management
              </h2>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-text-light" />
                <input
                  type="text"
                  placeholder="Search by city, state..."
                  className="px-4 py-2 border border-light-gray rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses.length > 0 ? (
                addresses.map((address: any) => (
                  <div key={address.id} className="bg-white rounded-lg shadow-sm border border-light-gray p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-text-primary">
                        {address.city}, {address.state}
                      </h3>
                      {address.isDefault && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mb-1">{address.streetAddress}</p>
                    <p className="text-sm text-text-secondary mb-4">{address.zipCode} - {address.country}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 text-sm py-2 text-text-primary hover:bg-light-gray rounded transition-colors">
                        <Edit className="h-4 w-4 inline mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 text-sm py-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="h-4 w-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-text-secondary">
                  No addresses found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
