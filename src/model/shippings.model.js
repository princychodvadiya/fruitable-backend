const mongoose = require('mongoose');

const shippingsSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        status: {
            type: String,
            required: true

        },
        location: {
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

const Shippings = mongoose.model('Shippings', shippingsSchema);

module.exports = Shippings;