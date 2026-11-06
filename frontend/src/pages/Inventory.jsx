import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        supplier: "",
        department: "",
        minimumStock: 5
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/inventory",
                {
                    ...formData,
                    quantity: Number(formData.quantity),
                    price: Number(formData.price),
                    minimumStock: Number(formData.minimumStock)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Inventory item added successfully!");

            navigate("/dashboard");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to add inventory item."
            );
        }
    };

    return (
        <div style={{
            maxWidth: "750px",
            margin: "40px auto",
            padding: "30px",
            background: "white",
            borderRadius: "12px"
        }}>

            <h2>Add New Inventory Item</h2>
            <p>Enter the details of your company product.</p>

            {message && (
                <p style={{ color: "red" }}>{message}</p>
            )}

            <form onSubmit={handleSubmit}>

                {[
                    ["itemCode", "Item Code"],
                    ["itemName", "Item Name"],
                    ["category", "Category"],
                    ["description", "Description"],
                    ["quantity", "Quantity"],
                    ["unit", "Unit (pcs, box, etc.)"],
                    ["price", "Price"],
                    ["supplier", "Supplier"],
                    ["department", "Department"],
                    ["minimumStock", "Minimum Stock Level"]
                ].map(([name, label]) => (
                    <div key={name} style={{ marginBottom: "15px" }}>

                        <label style={{ display: "block", marginBottom: "6px" }}>
                            {label}
                        </label>

                        <input
                            type={
                                ["quantity", "price", "minimumStock"].includes(name)
                                    ? "number"
                                    : "text"
                            }
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            required={[
                                "itemCode",
                                "itemName",
                                "category",
                                "quantity",
                                "unit",
                                "price",
                                "department"
                            ].includes(name)}
                            min={
                                ["quantity", "price", "minimumStock"].includes(name)
                                    ? "0"
                                    : undefined
                            }
                            step={name === "price" ? "0.01" : "1"}
                            style={{
                                width: "100%",
                                padding: "11px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>
                ))}

                <button
                    type="submit"
                    style={{
                        background: "#172554",
                        color: "white",
                        padding: "12px 22px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Save Inventory
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    style={{
                        marginLeft: "10px",
                        padding: "12px 22px",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default Inventory;
