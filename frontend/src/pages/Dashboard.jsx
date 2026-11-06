
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    LayoutDashboard,
    Package,
    Boxes,
    AlertTriangle,
    LogOut,
    Search,
    Bell,
    Plus,
    ArrowUpRight,
    RefreshCw
} from "lucide-react";

import "../App.css";

function Dashboard() {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalStock: 0,
        lowStock: 0
    });

    const [recentInventory, setRecentInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recentLoading, setRecentLoading] = useState(true);
    const [recentError, setRecentError] = useState("");

    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [alertLoading, setAlertLoading] = useState(true);
    const [alertError, setAlertError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    // GET DASHBOARD SUMMARY
    const fetchSummary = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/inventory/summary",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSummary(response.data);
        } catch (error) {
            console.error(
                "Failed to load dashboard summary:",
                error.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    // GET RECENT INVENTORY
    const fetchRecentInventory = async () => {
        try {
            setRecentLoading(true);
            setRecentError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/inventory",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const products = Array.isArray(response.data)
                ? response.data
                : response.data.inventory ||
                  response.data.items ||
                  [];

            const sortedProducts = [...products].sort((a, b) => {
                return (
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
                );
            });

            setRecentInventory(sortedProducts.slice(0, 5));
        } catch (error) {
            console.error(
                "Failed to load recent inventory:",
                error.response?.data || error.message
            );

            setRecentError(
                error.response?.data?.message ||
                "Unable to load recent inventory products."
            );
        } finally {
            setRecentLoading(false);
        }
    };

    // GET LOW STOCK PRODUCTS
    const fetchLowStockProducts = async () => {
        try {
            setAlertLoading(true);
            setAlertError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/inventory",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const products = Array.isArray(response.data)
                ? response.data
                : response.data.inventory ||
                  response.data.items ||
                  [];

            const lowStockItems = products.filter((item) => {
                const quantity = Number(item.quantity || 0);
                const minimumStock = Number(item.minimumStock ?? 5);

                return quantity <= minimumStock;
            });

            setLowStockProducts(lowStockItems);
        } catch (error) {
            console.error(
                "Failed to load low stock alerts:",
                error.response?.data || error.message
            );

            setAlertError(
                error.response?.data?.message ||
                "Unable to load low stock alerts."
            );
        } finally {
            setAlertLoading(false);
        }
    };

    // REFRESH DASHBOARD
    const refreshDashboard = () => {
        fetchSummary();
        fetchRecentInventory();
        fetchLowStockProducts();
    };

    useEffect(() => {
        refreshDashboard();
    }, []);

    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <Package size={25} />
                    </div>

                    <div>
                        <h2>KPD Company Inventory Tracker</h2>
                    </div>
                </div>

                <p className="sidebar-label">
                    MAIN MENU
                </p>

                <nav className="sidebar-nav">

                    <a
                        className="nav-link active"
                        href="/dashboard"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/dashboard");
                        }}
                    >
                        <LayoutDashboard size={19} />
                        Dashboard
                    </a>

                    <a
                        className="nav-link"
                        href="/inventory-list"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/inventory-list");
                        }}
                    >
                        <Package size={19} />
                        Inventory
                    </a>

                </nav>

                <div className="sidebar-bottom">

                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {(user.name || "Admin")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="user-details">
                            <strong>
                                {user.name || "Administrator"}
                            </strong>

                            <span>Administrator</span>
                        </div>
                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">

                <header className="dashboard-topbar">
                    <div>
                        <p>
                            Manage and monitor your company inventory
                        </p>
                    </div>

                    <div className="topbar-actions">

                        <div className="dashboard-search">
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search..."
                            />
                        </div>

                        <button
                            className="notification-button"
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                        </button>

                    </div>
                </header>

                <section className="dashboard-page-content">

                    {/* WELCOME SECTION */}
                    <div className="welcome-banner">
                        <div>
                            <span className="welcome-tag">
                                INVENTORY MANAGEMENT
                            </span>

                            <p>
                                Here's what's happening with your company inventory today
                            </p>
                        </div>

                        <div className="welcome-icon">
                            <Boxes size={65} />
                        </div>
                    </div>

                    {/* INVENTORY OVERVIEW */}
                    <div className="section-heading">
                        <div>
                            <h2>Inventory Overview</h2>
                        </div>

                        <span className="overview-status">
                            Live Overview
                        </span>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="summary-grid">

                        {/* TOTAL PRODUCTS */}
                        <div className="summary-card">
                            <div className="summary-card-top">
                                <div className="summary-icon blue">
                                    <Package size={23} />
                                </div>

                                <ArrowUpRight
                                    size={19}
                                    className="summary-arrow"
                                />
                            </div>

                            <h3>
                                {loading ? "..." : summary.totalProducts}
                            </h3>

                            <p>Total Products</p>
                            <span>All registered items</span>
                        </div>

                        {/* TOTAL STOCK */}
                        <div className="summary-card">
                            <div className="summary-card-top">
                                <div className="summary-icon purple">
                                    <Boxes size={23} />
                                </div>

                                <ArrowUpRight
                                    size={19}
                                    className="summary-arrow"
                                />
                            </div>

                            <h3>
                                {loading ? "..." : summary.totalStock}
                            </h3>

                            <p>Total Stock</p>
                            <span>Available item quantity</span>
                        </div>

                        {/* LOW STOCK */}
                        <div className="summary-card">
                            <div className="summary-card-top">
                                <div className="summary-icon orange">
                                    <AlertTriangle size={23} />
                                </div>

                                <ArrowUpRight
                                    size={19}
                                    className="summary-arrow"
                                />
                            </div>

                            <h3>
                                {loading ? "..." : summary.lowStock}
                            </h3>

                            <p>Low Stock Items</p>
                            <span>Items needing attention</span>
                        </div>

                    </div>

                    {/* RECENT INVENTORY */}
                    <div className="inventory-panel">

                        <div className="panel-heading">
                            <div>
                                <h2>Recent Inventory</h2>
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>
                                <button
                                    onClick={refreshDashboard}
                                    title="Refresh dashboard"
                                    disabled={recentLoading || alertLoading}
                                >
                                    <RefreshCw size={18} />
                                </button>

                                <button
                                    className="add-inventory-button"
                                    onClick={() => navigate("/inventory")}
                                >
                                    <Plus size={18} />
                                    Add New Item
                                </button>
                            </div>
                        </div>

                        {recentLoading && (
                            <p style={{ padding: "25px" }}>
                                Loading recent inventory...
                            </p>
                        )}

                        {!recentLoading && recentError && (
                            <div style={{ padding: "25px" }}>
                                <p style={{ color: "red" }}>
                                    {recentError}
                                </p>

                                <button onClick={fetchRecentInventory}>
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!recentLoading && !recentError && (
                            <div style={{
                                width: "100%",
                                overflowX: "auto",
                                marginTop: "15px"
                            }}>
                                {recentInventory.length > 0 ? (
                                    <table style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        textAlign: "left"
                                    }}>
                                        <thead>
                                            <tr>
                                                {[
                                                    "Item Code",
                                                    "Product Name",
                                                    "Category",
                                                    "Quantity",
                                                    "Price"
                                                ].map((heading) => (
                                                    <th
                                                        key={heading}
                                                        style={{
                                                            padding: "14px 10px",
                                                            borderBottom: "1px solid #ddd",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {heading}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {recentInventory.map((item) => (
                                                <tr key={item._id}>
                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.itemCode}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.itemName}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.category}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.quantity} {item.unit}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        ₱{Number(item.price || 0).toLocaleString("en-PH", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="empty-inventory">
                                        <div className="empty-icon">
                                            <Package size={35} />
                                        </div>

                                        <h3>No Inventory Products Yet</h3>

                                        <p>
                                            Add your first product to see it displayed here.
                                        </p>

                                        <button
                                            className="add-inventory-button"
                                            onClick={() => navigate("/inventory")}
                                        >
                                            <Plus size={18} />
                                            Add New Item
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* LOW STOCK ALERTS */}
                    <div
                        className="inventory-panel"
                        style={{ marginTop: "25px" }}
                    >

                        <div className="panel-heading">
                            <div>
                                <h2>
                                    <AlertTriangle
                                        size={21}
                                        style={{
                                            display: "inline",
                                            marginRight: "8px",
                                            color: "#d97706",
                                            verticalAlign: "middle"
                                        }}
                                    />
                                    Low Stock Alerts
                                </h2>

                                <p>
                                    Products that need restocking.
                                </p>
                            </div>

                            <span style={{
                                backgroundColor: lowStockProducts.length > 0
                                    ? "#fef3c7"
                                    : "#dcfce7",
                                color: lowStockProducts.length > 0
                                    ? "#92400e"
                                    : "#166534",
                                padding: "7px 12px",
                                borderRadius: "20px",
                                fontSize: "13px",
                                fontWeight: "600"
                            }}>
                                {alertLoading
                                    ? "Checking..."
                                    : `${lowStockProducts.length} Products`}
                            </span>
                        </div>

                        {alertLoading && (
                            <p style={{ padding: "25px" }}>
                                Checking product stock levels...
                            </p>
                        )}

                        {!alertLoading && alertError && (
                            <div style={{ padding: "25px" }}>
                                <p style={{ color: "red" }}>
                                    {alertError}
                                </p>

                                <button onClick={fetchLowStockProducts}>
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!alertLoading && !alertError && (
                            <div style={{
                                width: "100%",
                                overflowX: "auto",
                                marginTop: "15px"
                            }}>
                                {lowStockProducts.length > 0 ? (
                                    <table style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        textAlign: "left"
                                    }}>
                                        <thead>
                                            <tr>
                                                {[
                                                    "Item Code",
                                                    "Product Name",
                                                    "Department",
                                                    "Available Quantity",
                                                    "Minimum Stock",
                                                    "Status"
                                                ].map((heading) => (
                                                    <th
                                                        key={heading}
                                                        style={{
                                                            padding: "14px 10px",
                                                            borderBottom: "1px solid #ddd",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {heading}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {lowStockProducts.map((item) => {
                                                const quantity = Number(item.quantity || 0);
                                                const minimumStock = Number(item.minimumStock ?? 5);
                                                const outOfStock = quantity <= 0;

                                                return (
                                                    <tr key={item._id}>
                                                        <td style={{ padding: "14px 10px" }}>
                                                            {item.itemCode}
                                                        </td>

                                                        <td style={{ padding: "14px 10px" }}>
                                                            {item.itemName}
                                                        </td>

                                                        <td style={{ padding: "14px 10px" }}>
                                                            {item.department}
                                                        </td>

                                                        {/* AVAILABLE QUANTITY - NORMAL FONT */}
                                                        <td style={{ padding: "14px 10px" }}>
                                                            {quantity} {item.unit}
                                                        </td>

                                                        <td style={{ padding: "14px 10px" }}>
                                                            {minimumStock} {item.unit}
                                                        </td>

                                                        <td style={{ padding: "14px 10px" }}>
                                                            <span style={{
                                                                display: "inline-block",
                                                                padding: "6px 12px",
                                                                borderRadius: "20px",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                                whiteSpace: "nowrap",
                                                                backgroundColor: outOfStock
                                                                    ? "#fee2e2"
                                                                    : "#fef3c7",
                                                                color: outOfStock
                                                                    ? "#b91c1c"
                                                                    : "#92400e"
                                                            }}>
                                                                {outOfStock
                                                                    ? "Out of Stock"
                                                                    : "Low Stock"}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div style={{
                                        padding: "30px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{
                                            color: "#16a34a",
                                            marginBottom: "10px"
                                        }}>
                                            <Package size={35} />
                                        </div>

                                        <h3>All Stock Levels Are Good!</h3>

                                        <p>
                                            There are currently no products that need restocking.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px"
                        }}>
                            <button
                                className="add-inventory-button"
                                onClick={() => navigate("/inventory-list")}
                            >
                                View Inventory
                            </button>
                        </div>

                    </div>

                    {/* FOOTER */}
                    <footer className="dashboard-footer">
                        © 2026 KPD Company Inventory Tracker.
                        All rights reserved.
                    </footer>

                </section>
            </main>
        </div>
    );
}

export default Dashboard;
