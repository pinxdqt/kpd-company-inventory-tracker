import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    LayoutDashboard,
    Package,
    Boxes,
    AlertTriangle,
    LogOut,
    Plus,
    RefreshCw,
    ArrowUpRight,
    Search,
    X
} from "lucide-react";

import "../App.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function Dashboard() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // GET INVENTORY
    const fetchInventory = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/api/inventory`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const products = Array.isArray(response.data)
                ? response.data
                : response.data.inventory || response.data.items || [];

            const sortedProducts = [...products].sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            );

            setInventory(sortedProducts);

        } catch (err) {
            console.error(
                "Dashboard loading error:",
                err.response?.data || err.message
            );

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load inventory. Please check your backend connection."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    // TOTAL PRODUCTS
    const totalProducts = inventory.length;

    // TOTAL STOCK
    const totalStock = inventory.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    // PRODUCTS NEEDING ATTENTION (0 TO 10)
    const lowStockProducts = inventory.filter((item) => {
        const quantity = Number(item.quantity || 0);
        return quantity >= 0 && quantity <= 10;
    });

    // RECENT INVENTORY
    const recentInventory = inventory.slice(0, 5);

    // STOCK STATUS
    const getStockStatus = (item) => {
        const quantity = Number(item.quantity || 0);

        if (quantity <= 0) {
            return {
                label: "No Stock",
                background: "#fee2e2",
                color: "#b91c1c"
            };
        }

        if (quantity <= 10) {
            return {
                label: "Restock Soon!",
                background: "#fef3c7",
                color: "#92400e"
            };
        }

        return {
            label: "Enough Stock",
            background: "#dcfce7",
            color: "#166534"
        };
    };

    // SEARCH INVENTORY
    const searchResults = inventory.filter((item) => {
        const search = searchTerm.toLowerCase().trim();

        return (
            String(item.itemCode || "").toLowerCase().includes(search) ||
            String(item.itemName || "").toLowerCase().includes(search) ||
            String(item.category || "").toLowerCase().includes(search)
        );
    });

    // FORMAT PRICE
    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">
                        <Package size={25} />
                    </div>

                    <div>
                        <h2>KPD Inventory Tracker</h2>
                    </div>
                </div>

                <p className="sidebar-label">MAIN MENU</p>

                <nav className="sidebar-nav">

                    <a
                        href="/dashboard"
                        className="nav-link active"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate("/dashboard");
                        }}
                    >
                        <LayoutDashboard size={19} />
                        Dashboard
                    </a>

                    <a
                        href="/inventory-list"
                        className="nav-link"
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
                            {(user.name || "Admin").charAt(0).toUpperCase()}
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

                {/* TOP BAR WITH SEARCH */}
                <header className="dashboard-topbar">

                    <div>
                        <p>Manage and monitor your inventory</p>
                    </div>

                    <div className="dashboard-search">

                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search item code, product name, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm("")}
                                title="Clear search"
                            >
                                <X size={18} />
                            </button>
                        )}

                    </div>

                </header>

                <section className="dashboard-page-content">

                    {/* WELCOME */}
                    <div className="welcome-banner">

                        <div>
                            <span
                                className="welcome-tag"
                                style={{
                                    fontSize: "20px",
                                    letterSpacing: "1.5px",
                                    fontWeight: "600"
                                }}
                            >
                                INVENTORY MANAGEMENT
                            </span>
                        </div>

                        <div className="welcome-icon">
                            <Boxes size={65} />
                        </div>

                    </div>

                    {/* SEARCH RESULTS */}
                    {searchTerm.trim() !== "" && (

                        <div
                            className="inventory-panel"
                            style={{ marginBottom: "25px" }}
                        >

                            <div className="panel-heading">
                                <div>
                                    <h2>Search Results</h2>

                                    <p>
                                        {searchResults.length} matching product(s) found.
                                    </p>
                                </div>
                            </div>

                            {searchResults.length > 0 ? (

                                <div style={{
                                    width: "100%",
                                    overflowX: "auto"
                                }}>

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
                                            {searchResults.map((item) => (
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
                                                        ₱{formatPrice(item.price)}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>

                                </div>

                            ) : (
                                <p style={{ padding: "25px" }}>
                                    No matching products found.
                                </p>
                            )}

                        </div>
                    )}

                    {/* PAGE HEADING */}
                    <div className="section-heading">

                        <div>
                            <h2>Inventory Overview</h2>
                        </div>

                        <span className="overview-status">
                            Live Overview
                        </span>

                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (

                        <div style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            padding: "14px",
                            borderRadius: "8px",
                            marginBottom: "20px"
                        }}>

                            {error}

                            <button
                                onClick={fetchInventory}
                                style={{ marginLeft: "12px" }}
                            >
                                Try Again
                            </button>

                        </div>
                    )}

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

                            <h3>{loading ? "..." : totalProducts}</h3>

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

                            <h3>{loading ? "..." : totalStock}</h3>

                            <p>Total Stock</p>

                            <span>Available item quantity</span>

                        </div>

                        {/* ITEMS NEEDING ATTENTION */}
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
                                {loading ? "..." : lowStockProducts.length}
                            </h3>

                            <p>Items Needing Attention</p>

                            <span>Products with 10 or fewer items</span>

                        </div>

                    </div>

                    {/* RECENT INVENTORY */}
                    <div className="inventory-panel">

                        <div className="panel-heading">

                            <div>
                                <h2>Recent Inventory</h2>
                                <p>Your latest added products.</p>
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap"
                            }}>

                                <button
                                    onClick={fetchInventory}
                                    disabled={loading}
                                    title="Refresh dashboard"
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

                        {loading ? (

                            <p style={{ padding: "25px" }}>
                                Loading inventory...
                            </p>

                        ) : recentInventory.length > 0 ? (

                            <div style={{
                                width: "100%",
                                overflowX: "auto",
                                marginTop: "15px"
                            }}>

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
                                                    ₱{formatPrice(item.price)}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="empty-inventory">

                                <div className="empty-icon">
                                    <Package size={35} />
                                </div>

                                <h3>No Inventory Products Yet</h3>

                                <p>
                                    Add your first product to display it here.
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
                                background: lowStockProducts.length > 0
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
                                {loading
                                    ? "Checking..."
                                    : `${lowStockProducts.length} Products`}
                            </span>

                        </div>

                        {loading ? (

                            <p style={{ padding: "25px" }}>
                                Checking product stock levels...
                            </p>

                        ) : lowStockProducts.length > 0 ? (

                            <div style={{
                                width: "100%",
                                overflowX: "auto",
                                marginTop: "15px"
                            }}>

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
                                                "Available Quantity",
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

                                            const status = getStockStatus(item);

                                            return (
                                                <tr key={item._id}>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.itemCode}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.itemName}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        {item.quantity} {item.unit}
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>

                                                        <span style={{
                                                            display: "inline-block",
                                                            padding: "6px 12px",
                                                            borderRadius: "20px",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            background: status.background,
                                                            color: status.color,
                                                            whiteSpace: "nowrap"
                                                        }}>
                                                            {status.label}
                                                        </span>

                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                </table>

                            </div>

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
                        Â© 2026 KPD Inventory Tracker. All rights reserved.
                    </footer>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;