const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        payment_id: {
            type: mongoose.Types.ObjectId,
            ref: "Payments",
            required: true,
        },
        variant_id: {
            type: mongoose.Types.ObjectId,
            ref: "Variants",
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        payment_method: {
            type: String,
            required: true,
        },
        payment_status: {
            type: String,
            required: true,
        },
        total_price: {
            type: Number,
            required: true, 
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true,
        }    
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;