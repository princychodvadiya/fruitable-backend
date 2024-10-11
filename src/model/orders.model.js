const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: "Products",
            // required: true,
        },
        quntity: {
            type: Number,
            required: true,
            default: 1,
        },
    }

)
const ordersSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        address: {
            street: {
                type: String,
                required: true,
            },
            block_number: {
                type: Number,
                required: true,
            },
            locality: {
                type: String,
                required: true,
            },
        },
        payment_method: {
            type: String,
            default: 'COD',
        },
        status: {
            type: String,
            default: 'Pending',
        },
        total_amount: {
            type: Number,
            required: true,
        },
        items: [itemSchema],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;