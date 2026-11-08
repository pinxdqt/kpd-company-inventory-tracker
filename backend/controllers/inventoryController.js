
const Inventory = require("../models/Inventory");

// GET ALL INVENTORY
const getInventory = async (req, res) => {
    try {
        const items = await Inventory.find().sort({ createdAt: -1 });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get inventory.",
            error: error.message
        });
    }
};

// ADD INVENTORY
const addInventory = async (req, res) => {
    try {
        const newItem = new Inventory(req.body);

        await newItem.save();

        res.status(201).json({
            message: "Inventory added successfully!",
            item: newItem
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to add inventory.",
            error: error.message
        });
    }
};

// UPDATE INVENTORY
const updateInventory = async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                message: "Inventory item not found."
            });
        }

        res.status(200).json({
            message: "Inventory updated successfully!",
            item: updatedItem
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update inventory.",
            error: error.message
        });
    }
};

// DELETE INVENTORY
const deleteInventory = async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(
            req.params.id
        );

        if (!deletedItem) {
            return res.status(404).json({
                message: "Inventory item not found."
            });
        }

        res.status(200).json({
            message: "Inventory deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete inventory.",
            error: error.message
        });
    }
};

// GET INVENTORY SUMMARY FOR DASHBOARD
const getInventorySummary = async (req, res) => {
    try {
        const totalProducts = await Inventory.countDocuments();

        const stockResult = await Inventory.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$quantity" }
                }
            }
        ]);

        const totalStock = stockResult.length > 0
            ? stockResult[0].total
            : 0;

        // Low stock means 1 to 10 items remaining
        const lowStock = await Inventory.countDocuments({
            quantity: {
                $gte: 1,
                $lte: 10
            }
        });

        // Count items with no stock
        const outOfStock = await Inventory.countDocuments({
            quantity: 0
        });

        res.status(200).json({
            totalProducts,
            totalStock,
            lowStock,
            outOfStock
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to get inventory summary",
            error: error.message
        });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    getInventory,
    addInventory,
    updateInventory,
    deleteInventory,
    getInventorySummary
};
