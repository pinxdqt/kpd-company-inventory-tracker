
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    LayoutDashboard,
    Package,
    LogOut,
    Search,
    Pencil,
    Trash2,
    ArrowLeft,
    RefreshCw,
    X
} from "lucide-react";

import "../App.css";

function InventoryList() {
    const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // EDIT STATES
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState("");

    // EDIT FORM DATA
    const [formData, setFormData] = useState({
        itemCode: "",
        itemName: "",
        category: "",
        description: "",
        quantity: "",
        unit: "",
        price: "",
        supplier: "",
        minimumStock: ""
    });

    // GET LOGGED-IN USER
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    // GET INVENTORY PRODUCTS
    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError("");

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

            setInventory(products);

        } catch (err) {
            console.error("Inventory loading error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load inventory products."
            );

        } finally {
            setLoading(false);
        }
    };

    // LOAD PRODUCTS WHEN PAGE OPENS
    useEffect(() => {
        fetchInventory();
    }, []);

    // CHECK PRODUCT STOCK STATUS
    const getStockStatus = (item) => {
        const quantity = Number(item.quantity || 0);
        const minimumStock = Number(item.minimumStock ?? 5);

        if (quantity <= 0) {
            return {
                label: "Out of Stock",
                background: "#fee2e2",
                color: "#b91c1c"
            };
        }

        if (quantity <= minimumStock) {
            return {
                label: "Low Stock",
                background: "#fef3c7",
                color: "#92400e"
            };
        }

        return {
            label: "In Stock",
            background: "#dcfce7",
            color: "#166534"
        };
    };

    // SEARCH PRODUCTS
    const filteredInventory = inventory.filter((item) => {
        const searchText = search.toLowerCase();

        return (
            (item.itemName || "").toLowerCase().includes(searchText) ||
            (item.itemCode || "").toLowerCase().includes(searchText) ||
            (item.category || "").toLowerCase().includes(searchText) ||
            (item.description || "").toLowerCase().includes(searchText)
        );
    });

    // OPEN EDIT FORM
    const handleEdit = (item) => {
        setEditingId(item._id);

        setFormData({
            itemCode: item.itemCode || "",
            itemName: item.itemName || "",
            category: item.category || "",
            description: item.description || "",
            quantity: item.quantity ?? 0,
            unit: item.unit || "",
            price: item.price ?? 0,
            supplier: item.supplier || "",
            minimumStock: item.minimumStock ?? 5
        });

        setEditError("");
        setShowEditForm(true);
    };

    // HANDLE FORM INPUTS
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // CLOSE EDIT FORM
    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditingId(null);
        setEditError("");
    };

    // SAVE UPDATED PRODUCT
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setEditError("");

            const token = localStorage.getItem("token");

            const updatedData = {
                ...formData,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                minimumStock: Number(formData.minimumStock)
            };

            await axios.put(
                `http://localhost:5000/api/inventory/${editingId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product updated successfully!");

            setShowEditForm(false);
            setEditingId(null);

            await fetchInventory();

        } catch (err) {
            console.error("Update error:", err);

            setEditError(
                err.response?.data?.message ||
                "Unable to update product. Please try again."
            );

        } finally {
            setSaving(false);
        }
    };

    // DELETE PRODUCT
    const handleDelete = async (id, itemName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${itemName}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/inventory/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Product deleted successfully!");

            if (editingId === id) {
                setShowEditForm(false);
                setEditingId(null);
            }

            await fetchInventory();

        } catch (err) {
            console.error("Delete error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to delete product. Please try again."
            );
        }
    };

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
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
                        className="nav-link active"
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
                            Manage your company inventory products
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
                    </div>

                </header>

                <section className="dashboard-page-content">

                    {/* PAGE TITLE */}
                    <div className="section-heading">
                        <div>
                            <h2>Inventory Management</h2>

                            <p>
                                View and manage all your registered products
                            </p>
                        </div>
                    </div>

                    {/* INVENTORY PANEL */}
                    <div className="inventory-panel">

                        <div className="panel-heading">

                            <div>
                                <h2>Product List</h2>

                                <p>
                                    Total Products: {inventory.length}
                                </p>
                            </div>

                            <button
                                onClick={fetchInventory}
                                title="Refresh inventory"
                                disabled={loading}
                            >
                                <RefreshCw size={18} />
                            </button>

                        </div>

                        {/* SEARCH BAR */}
                        <div className="dashboard-search">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search by item name, code, category or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                        {/* EDIT PRODUCT FORM */}
                        {showEditForm && (

                            <div style={{
                                marginTop: "25px",
                                padding: "25px",
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                backgroundColor: "#fff"
                            }}>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "20px"
                                }}>

                                    <div>
                                        <h2>Edit Inventory Product</h2>

                                        <p>
                                            Update the product information below.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        title="Close form"
                                    >
                                        <X size={20} />
                                    </button>

                                </div>

                                {editError && (
                                    <p style={{
                                        color: "red",
                                        marginBottom: "15px"
                                    }}>
                                        {editError}
                                    </p>
                                )}

                                <form onSubmit={handleUpdate}>

                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                        gap: "15px"
                                    }}>

                                        <div>
                                            <label>Item Code</label>
                                            <input
                                                type="text"
                                                name="itemCode"
                                                value={formData.itemCode}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div>
                                            <label>Product Name</label>
                                            <input
                                                type="text"
                                                name="itemName"
                                                value={formData.itemName}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div>
                                            <label>Category</label>

                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            >
                                                <option value="">
                                                    Select Category
                                                </option>

                                                <option value="School Supplies">
                                                    School Supplies
                                                </option>

                                                <option value="Office Supplies">
                                                    Office Supplies
                                                </option>

                                            </select>
                                        </div>

                                        <div>
                                            <label>Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                min="0"
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div>
                                            <label>Unit</label>
                                            <input
                                                type="text"
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div>
                                            <label>Price (₱)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                min="0"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div>
                                            <label>Supplier</label>
                                            <input
                                                type="text"
                                                name="supplier"
                                                value={formData.supplier}
                                                onChange={handleInputChange}
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div>
                                            <label>Minimum Stock</label>
                                            <input
                                                type="number"
                                                name="minimumStock"
                                                min="0"
                                                value={formData.minimumStock}
                                                onChange={handleInputChange}
                                                required
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div style={{
                                            gridColumn: "1 / -1"
                                        }}>
                                            <label>Product Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Enter product description..."
                                                rows="3"
                                                style={{
                                                    ...inputStyle,
                                                    resize: "vertical"
                                                }}
                                            />
                                        </div>

                                    </div>

                                    <div style={{
                                        display: "flex",
                                        gap: "10px",
                                        marginTop: "25px"
                                    }}>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            style={saveButtonStyle}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            style={cancelButtonStyle}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            </div>

                        )}

                        {/* LOADING */}
                        {loading && (
                            <p>Loading inventory products...</p>
                        )}

                        {/* ERROR */}
                        {!loading && error && (
                            <div>
                                <p style={{ color: "red" }}>
                                    {error}
                                </p>

                                <button onClick={fetchInventory}>
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* INVENTORY TABLE */}
                        {!loading && !error && (

                            <div style={{
                                width: "100%",
                                overflowX: "auto",
                                marginTop: "20px"
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
                                                "Stock Status",
                                                "Price",
                                                "Product Description",
                                                "Actions"
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

                                        {filteredInventory.map((item) => {

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
                                                        {item.category}
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
                                                            backgroundColor: status.background,
                                                            color: status.color,
                                                            whiteSpace: "nowrap"
                                                        }}>
                                                            {status.label}
                                                        </span>
                                                    </td>

                                                    <td style={{ padding: "14px 10px" }}>
                                                        ₱{Number(item.price || 0).toLocaleString("en-PH", {
                                                            minimumFractionDigits: 2
                                                        })}
                                                    </td>

                                                    <td style={{
                                                        padding: "14px 10px",
                                                        minWidth: "200px"
                                                    }}>
                                                        {item.description || "—"}
                                                    </td>

                                                    <td style={{
                                                        padding: "14px 10px",
                                                        whiteSpace: "nowrap"
                                                    }}>

                                                        <button
                                                            title="Edit product"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <Pencil size={17} />
                                                        </button>

                                                        <button
                                                            title="Delete product"
                                                            onClick={() => handleDelete(item._id, item.itemName)}
                                                            style={{ marginLeft: "10px" }}
                                                        >
                                                            <Trash2 size={17} />
                                                        </button>

                                                    </td>

                                                </tr>
                                            );
                                        })}

                                        {filteredInventory.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    style={{
                                                        padding: "30px",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {search
                                                        ? "No matching products found."
                                                        : "No inventory products yet."}
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                    {/* BACK TO DASHBOARD */}
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 16px",
                            cursor: "pointer"
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>

                    <footer className="dashboard-footer">
                        © 2026 KPD Company Inventory Tracker.
                        All rights reserved.
                    </footer>

                </section>

            </main>

        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "11px",
    marginTop: "7px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing: "border-box"
};

const saveButtonStyle = {
    padding: "11px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const cancelButtonStyle = {
    padding: "11px 20px",
    backgroundColor: "#eee",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

export default InventoryList;
