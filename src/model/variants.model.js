const mongoose = require('mongoose');

// const attributeSchema = new mongoose.Schema(
//     {
//         // name: {
//         //     type: String,
//         //     // required: true
//         // },
//         // value: {
//         //     type: String,
//         //     // required: true
//         // },
//         price: {
//             type: Number,
//             // required: true
//         },
//         stock: {
//             type: Number,
//             // required: true
//         },
//         additionalFields: {
//             type: Object,
//         }
//     }
// )

const variantsSchema = new mongoose.Schema(
    {
        category_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Categories',
            required: true
        },
        subcategory_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Subcategories',
            required: true
        },
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        price: {
            type: Number,
            // required: true
        },
        stock: {
            type: Number,
            // required: true
        },
        discount: {
            type: Number,
        },
        attributes: {},
        variant_image: {
            type: {
                public_id: String,
                url: String
            }
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

const Variants = mongoose.model('Variants', variantsSchema);

module.exports = Variants;