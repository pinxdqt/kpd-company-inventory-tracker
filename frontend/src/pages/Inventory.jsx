import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    LayoutDashboard,
    Package,
    LogOut,
    ArrowLeft,
    Save
} from "lucide-react";

import "../App.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function Inventory() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        itemCode: "",
        itemName: "",
        category: "",
        description: "",
        quantity: "",
        unit: "",
        price: "",
        supplier: ""
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [saving, setSaving] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    // HANDLE INPUT CHANGES
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ADD NEW INVENTORY
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setMessageType("");

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Your login session has expired. Please log in again.");
            setMessageType("error");
            return;
        }

        if (
            !formData.itemCode.trim() ||
            !formData.itemName.trim() ||
            !formData.category ||
            !formData.unit.trim()
        ) {
            setMessage("Please complete all required fields.");
            setMessageType("error");
            return;
        }

        const quantity = Number(formData.quantity);
        const price = Number(formData.price);

        if (
            formData.quantity === "" ||
            formData.price === "" ||
            !Number.isFinite(quantity) ||
            !Number.isFinite(price) ||
            quantity < 0 ||
            price < 0
        ) {
            setMessage("Please enter a valid quantity and price.");
            setMessageType("error");
            return;
        }

        const newItem = {
            itemCode: formData.itemCode.trim(),
            itemName: formData.itemName.trim(),
            category: formData.category,
            description: formData.description.trim(),
            quantity,
            unit: formData.unit.trim(),
            price,
            supplier: formData.supplier.trim()
        };

        try {
            setSaving(true);

            const response = await axios.post(
                `${API_URL}/api/inventory`,
                newItem,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(
                response.data.message || "Inventory added successfully!"
            );

            setMessageType("success");

            setFormData({
                itemCode: "",
                itemName: "",
                category: "",
                description: "",
                quantity: "",
                unit: "",
                price: "",
                supplier: ""
            });

        } catch (error) {
            console.error(
                "Add inventory error:",
                error.response?.data || error.message
            );

            setMessage(
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Failed to add inventory. Please try again."
            );

            setMessageType("error");

        } finally {
            setSaving(false);
        }
    };

    // INPUT STYLE
    const inputStyle = {
        width: "100%",
        padding: "11px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        boxSizing: "border-box",
        fontSize: "14px",
        marginTop: "7px"
    };

    // LABEL STYLE
    const labelStyle = {
        display: "block",
        fontWeight: "600",
        fontSize: "14px",
        color: "#374151"
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
                        <h2>KPD Store Inventory Tracker</h2>
                    </div>

                </div>

                <p className="sidebar-label">
                    MAIN MENU
                </p>

                <nav className="sidebar-nav">

                    <a
                        href="/dashboard"
                        className="nav-link"
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
                            Add a new product to your inventory
                        </p>
                    </div>
                </header>

                <section className="dashboard-page-content">

                    <div className="inventory-panel">

                        {/* PAGE HEADING */}
                        <div className="panel-heading">

                            <div>
                                <h2>Add New Inventory</h2>

                                <p>
                                    Enter the product information below.
                                </p>
                            </div>

                        </div>

                        {/* SUCCESS OR ERROR MESSAGE */}
                        {message && (

                            <div style={{
                                padding: "12px 15px",
                                margin: "20px 0",
                                borderRadius: "7px",
                                background: messageType === "success"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color: messageType === "success"
                                    ? "#166534"
                                    : "#991b1b"
                            }}>
                                {message}
                            </div>

                        )}

                        {/* INVENTORY FORM */}
                        <form onSubmit={handleSubmit}>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                                gap: "20px",
                                marginTop: "25px"
                            }}>

                                {/* ITEM CODE */}
                                <div>
                                    <label style={labelStyle}>
                                        Item Code *
                                    </label>

                                    <input
                                        style={inputStyle}
                                        name="itemCode"
                                        value={formData.itemCode}
                                        onChange={handleChange}
                                        placeholder="Example: KPD-001"
                                        required
                                    />
                                </div>

                                {/* PRODUCT NAME */}
                                <div>
                                    <label style={labelStyle}>
                                        Product Name *
                                    </label>

                                    <input
                                        style={inputStyle}
                                        name="itemName"
                                        value={formData.itemName}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                {/* CATEGORY */}
                                <div>
                                    <label style={labelStyle}>
                                        Category *
                                    </label>

                                    <select
                                        style={inputStyle}
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="School Supplies">
                                            School Supplies
                                        </option>

                                        <option value="Office Supplies">
                                            Office Supplies
                                        </option>

                                    </select>
                                </div>

                                {/* QUANTITY */}
                                <div>
                                    <label style={labelStyle}>
                                        Quantity *
                                    </label>

                                    <input
                                        style={inputStyle}
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        step="1"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="Enter quantity"
                                        required
                                    />
                                </div>

                                {/* UNIT */}
                                <div>
                                    <label style={labelStyle}>
                                        Unit *
                                    </label>

                                    <input
                                        style={inputStyle}
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        placeholder="Example: pcs, box, pack"
                                        required
                                    />
                                </div>

                                {/* PRICE */}
                                <div>
                                    <label style={labelStyle}>
                                        Price (₱) *
                                    </label>

                                    <input
                                        style={inputStyle}
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>

                                {/* SUPPLIER */}
                                <div>
                                    <label style={labelStyle}>
                                        Supplier
                                    </label>

                                    <input
                                        style={inputStyle}
                                        name="supplier"
                                        value={formData.supplier}
                                        onChange={handleChange}
                                        placeholder="Enter supplier name"
                                    />
                                </div>

                                {/* DESCRIPTION */}
                                <div style={{
                                    gridColumn: "1 / -1"
                                }}>
                                    <label style={labelStyle}>
                                        Description
                                    </label>

                                    <textarea
                                        style={{
                                            ...inputStyle,
                                            minHeight: "90px",
                                            resize: "vertical"
                                        }}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter product description"
                                    />
                                </div>

                            </div>

                            {/* FORM BUTTONS */}
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                                marginTop: "25px"
                            }}>

                                <button
                                    type="submit"
                                    className="add-inventory-button"
                                    disabled={saving}
                                >
                                    <Save size={18} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Inventory"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/inventory-list")}
                                    style={{
                                        padding: "11px 18px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "7px",
                                        cursor: "pointer",
                                        background: "#fff"
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    style={{
                                        padding: "11px 18px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "7px",
                                        cursor: "pointer",
                                        background: "#fff"
                                    }}
                                >
                                    <ArrowLeft size={16} />
                                    Back to Dashboard
                                </button>

                            </div>

                        </form>

                    </div>

                    {/* FOOTER */}
                    <footer className="dashboard-footer">
                        © 2026 KPD Store Inventory Tracker. All rights reserved.
                    </footer>

                </section>

            </main>

        </div>
    );
}

export default Inventory;