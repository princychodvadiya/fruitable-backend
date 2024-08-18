const mongoose = require('mongoose');

const paymentsSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        type: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Payments = mongoose.model('Payments', paymentsSchema);

module.exports = Payments;