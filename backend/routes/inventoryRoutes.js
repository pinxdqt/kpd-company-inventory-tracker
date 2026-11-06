
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getInventory,
    addInventory,
    updateInventory,
    deleteInventory,
    getInventorySummary
} = require("../controllers/inventoryController");

// VIEW INVENTORY
router.get("/", protect, getInventory);

// DASHBOARD SUMMARY
router.get("/summary", protect, getInventorySummary);

// ADD INVENTORY
router.post("/", protect, addInventory);

// UPDATE INVENTORY
router.put("/:id", protect, updateInventory);

// DELETE INVENTORY
router.delete("/:id", protect, deleteInventory);

module.exports = router;
