const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        image: {
            type: String,
            trim: true
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

const Categories = mongoose.model('categories', categoriesSchema);

module.exports = Categories;