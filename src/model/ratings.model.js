const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema(
    {
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        review: {
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

const Ratinges = mongoose.model('Ratinges', ratingsSchema);

module.exports = Ratinges;