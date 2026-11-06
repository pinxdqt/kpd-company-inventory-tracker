require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("KPD Company Inventory Tracker Backend is Running!");
});

// Start server and connect to database
const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
    }
};

startServer();
