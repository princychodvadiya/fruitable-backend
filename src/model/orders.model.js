const mongoose = require("mongoose");

const itemsScheema = new mongoose.Schema(
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
            ref: "User",
            required: true,
        },
        payment_id: {
            type: mongoose.Types.ObjectId,
            ref: "Payments",
            required: true,
        },
        seller_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        // payment_method: {
        //     type: String,
        //     required: true,
        // },
        // payment_status: {
        //     type: String,
        //     required: true,

        // },
        discount: {
            type: Number,
            require: true
        },
        shipping_address: {
            type: String,
            required: true,
        },
        item: [itemsScheema],
        total_price: {
            type: Number,
            required: true,
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