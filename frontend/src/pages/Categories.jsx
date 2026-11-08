import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    LayoutDashboard,
    Package,
    LogOut,
    BookOpen,
    BriefcaseBusiness,
    RefreshCw
} from "lucide-react";

import "../App.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function Categories() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // CATEGORY LIST
    const categories = [
        {
            name: "School Supplies",
            description: "Items and materials used for school activities.",
            icon: BookOpen,
            color: "#2563eb",
            background: "#dbeafe"
        },
        {
            name: "Office Supplies",
            description: "Items and materials used for office operations.",
            icon: BriefcaseBusiness,
            color: "#7c3aed",
            background: "#ede9fe"
        }
    ];

    // GET INVENTORY PRODUCTS
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/api/inventory`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const inventory = Array.isArray(response.data)
                ? response.data
                : response.data.inventory ||
                  response.data.items ||
                  [];

            setProducts(inventory);

        } catch (error) {
            console.error(
                "Failed to load categories:",
                error.response?.data || error.message
            );

            setError("Unable to load category information.");

        } finally {
            setLoading(false);
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        fetchProducts();
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
                        className="nav-link"
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
                            Manage your school and office supply categories
                        </p>
                    </div>
                </header>

                <section className="dashboard-page-content">

                    {/* PAGE HEADING */}
                    <div className="section-heading">
                        <div>
                            <h2>Inventory Categories</h2>
                            <p>
                                Organize your inventory into two categories.
                            </p>
                        </div>

                        <button
                            onClick={fetchProducts}
                            disabled={loading}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 15px",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                background: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            <RefreshCw size={17} />
                            Refresh
                        </button>
                    </div>

                    {/* CATEGORY CARDS */}
                    {loading ? (
                        <div className="inventory-panel">
                            <p style={{ padding: "25px" }}>
                                Loading categories...
                            </p>
                        </div>

                    ) : error ? (
                        <div className="inventory-panel">
                            <p
                                style={{
                                    padding: "25px",
                                    color: "red"
                                }}
                            >
                                {error}
                            </p>

                            <button
                                onClick={fetchProducts}
                                style={{ margin: "0 25px 25px" }}
                            >
                                Try Again
                            </button>
                        </div>

                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "20px",
                                marginTop: "20px"
                            }}
                        >

                            {categories.map((category) => {
                                const Icon = category.icon;

                                const categoryProducts = products.filter(
                                    (item) =>
                                        item.category?.toLowerCase() ===
                                        category.name.toLowerCase()
                                );

                                const totalQuantity = categoryProducts.reduce(
                                    (total, item) =>
                                        total + Number(item.quantity || 0),
                                    0
                                );

                                return (
                                    <div
                                        key={category.name}
                                        className="summary-card"
                                        style={{
                                            padding: "25px",
                                            minHeight: "220px"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginBottom: "20px"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "55px",
                                                    height: "55px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "12px",
                                                    backgroundColor:
                                                        category.background,
                                                    color: category.color
                                                }}
                                            >
                                                <Icon size={27} />
                                            </div>

                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    color: "#64748b"
                                                }}
                                            >
                                                Category
                                            </span>
                                        </div>

                                        <h3
                                            style={{
                                                fontSize: "20px",
                                                marginBottom: "8px"
                                            }}
                                        >
                                            {category.name}
                                        </h3>

                                        <p
                                            style={{
                                                color: "#64748b",
                                                fontSize: "14px",
                                                marginBottom: "18px"
                                            }}
                                        >
                                            {category.description}
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: "10px",
                                                marginBottom: "18px"
                                            }}
                                        >
                                            <div>
                                                <strong
                                                    style={{
                                                        fontSize: "23px"
                                                    }}
                                                >
                                                    {categoryProducts.length}
                                                </strong>

                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#64748b"
                                                    }}
                                                >
                                                    Products
                                                </p>
                                            </div>

                                            <div>
                                                <strong
                                                    style={{
                                                        fontSize: "23px"
                                                    }}
                                                >
                                                    {totalQuantity}
                                                </strong>

                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#64748b"
                                                    }}
                                                >
                                                    Total Stock
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            className="add-inventory-button"
                                            style={{ width: "100%" }}
                                            onClick={() =>
                                                navigate("/inventory-list")
                                            }
                                        >
                                            View Inventory
                                        </button>
                                    </div>
                                );
                            })}

                        </div>
                    )}

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

export default Categories;