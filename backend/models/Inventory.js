
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        itemCode: {
            type: String,
            required: true,
            unique: true
        },

        itemName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        quantity: {
            type: Number,
            required: true,
            default: 0
        },

        unit: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            default: 0
        },

        supplier: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Inventory", inventorySchema);
