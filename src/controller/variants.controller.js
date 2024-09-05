const { default: mongoose } = require("mongoose")
const Variants = require("../model/variants.model")
const uploadFile = require("../utils/cloudinary")

const getVariant = async (req, res) => {
    try {
        const variant = await Variants.findById(req.params.variant_id)

        if (!variant) {
            res.status(404).json({
                success: false,
                message: 'variant not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'variant fetch successfully.',
            data: variant
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const listVariants = async (req, res) => {
    try {
        const variant = await Variants.find();
        // console.log(variant);

        if (!variant) {
            res.status(404).json({
                success: false,
                meassage: 'variant not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'variant fetch successfully.',
            data: variant
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const addVariant = async (req, res) => {
    // console.log("llllllllllllllll", req.body);
    // console.log(req.body);
    // console.log(req.file);

    const fileRes = await uploadFile(req.file.path, "Variant");
    // console.log(fileRes);

    try {
        const variant = await Variants.create({
            ...req.body,
            variant_image: {
                public_id: fileRes.public_id,
                url: fileRes.url
            }
        });

        if (!variant) {
            res.status(400).json({
                success: false,
                message: 'variant not created.'
            })
        }

        res.status(201).json({
            success: true,
            message: 'variant created successfully.',
            data: variant
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const deleteVariant = async (req, res) => {
    try {
        const variant = await Variants.findByIdAndDelete(req.params.variant_id)

        if (!variant) {

            res.status(400).json({
                success: false,
                message: 'variant not deleted.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'variant deleted successfully.',
            data: variant
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const updateVariant = async (req, res) => {
    const variantId = req.params.variant_id;

    if (!variantId) {
        return res.status(400).json({
            success: false,
            message: 'Variant ID is required.'
        });
    }

    if (req.file) {
        // console.log("New image.");

        try {
            const fileRes = await uploadFile(req.file.path, "Variant");
            // console.log(fileRes);

            const updatedVariantData = {
                ...req.body,
                variant_image: {
                    public_id: fileRes.public_id,
                    url: fileRes.url
                }
            };

            const variant = await Variants.findByIdAndUpdate(variantId, updatedVariantData, { new: true, runValidators: true });

            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant not updated.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Variant updated successfully.',
                data: variant
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error. ' + error.message
            });
        }
    } else {
        // console.log("Old image.");

        try {
            const variant = await Variants.findByIdAndUpdate(variantId, req.body, { new: true, runValidators: true });
            // console.log(variant);

            if (!variant) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant not updated.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Variant updated successfully.',
                data: variant
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error. ' + error.message
            });
        }
    }
};

const countstock = async (req, res) => {
    const { product_id } = req.params;
    const variants = await Variants.aggregate([
        {
            $match: {
                product_id: new mongoose.Types.ObjectId(product_id)
            }
        },
        {
            $group: {
                _id: "$product_id",
                totalStock: { $sum: "$stock" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                productId: "$_id",
                totalStock: 1,
                "productDetails.name": 1,
                "productDetails.description": 1
            }
        }
    ])
    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })

    console.log(variants);
}

const activevarint = async (req, res) => {
    const variants = await Variants.aggregate([
        {
            $match: {
                isActive: true
            }
        },
        {
            $project: {
                _id: 1,
                categori_id: 1,
                subcategori_id: 1,
                product_id: 1,
                price: 1,
                stock: 1,
                discount: 1,
                attributes: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])
    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })
    console.log(variants);
}

const countptoduct = async (req, res) => {
    const variants = await Variants.aggregate([
        {
            $group: {
                _id: "$product_id",
                countVariants: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                product_id: "$_id",
                countVariants: 1
            }
        }
    ])
    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })
    console.log(variants);
}

const variantparticularproduct = async (req, res) => {
    const variants = await Variants.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        // {
        //     $match: {
        //         "productDetails.name": "radishes" 
        //     }
        // },
        {
            $project: {
                _id: 1,
                categori_id: 1,
                subcategori_id: 1,
                product_id: 1,
                price: 1,
                stock: 1,
                discount: 1,
                attributes: 1,
                isActive: 1,
                createdAt: 1,
                updatedAt: 1,
                "productDetails._id": 1,
                "productDetails.name": 1,
                "productDetails.description": 1,
                "productDetails.price": 1,
                "productDetails.stock": 1,
                "productDetails.isActive": 1,
                "productDetails.createdAt": 1,
                "productDetails.updatedAt": 1
            }
        }
    ])
    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })

    console.log(variants);
}

const Variantdetails = async (req, res) => {
    const { product_id } = req.params;
    const variants = await Variants.aggregate([
        {
            $match: {
                product_id: new mongoose.Types.ObjectId(product_id)
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 1,
                categori_id: 1,
                subcategori_id: 1,
                product_id: 1,
                price: 1,
                stock: 1,
                discount: 1,
                attributes: 1,
                isActive: 1,
                createdAt: 1,
                updatedAt: 1,
                "productDetails._id": 1,
                "productDetails.name": 1,
                "productDetails.description": 1,
                "productDetails.price": 1,
                "productDetails.stock": 1,
                "productDetails.isActive": 1,
                "productDetails.createdAt": 1,
                "productDetails.updatedAt": 1
            }
        }
    ])
    res.status(200).json({
        success: true,
        data: variants,
        message: "variant get  succesfully"
    })
    console.log(variants);
}

const productslowstock = async (req, res) => {
    const variants = await Variants.aggregate([
        {
            $match: {
                stock: { $lt: 20 }
            }
        },
        {
            $group: {
                _id: "$product_id",
                totalStock: { $sum: "$stock" },
                variants: {
                    $push: {
                        variant_id: "$_id",
                        stock: "$stock",
                        price: "$price",
                        discount: "$discount",
                        attributes: "$attributes"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },

        {
            $project: {
                _id: 0,
                productId: "$_id",
                totalStock: 1,
                variants: 1,
                "productDetails.name": 1,
                "productDetails.description": 1
            }
        }
    ])
    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })

    console.log(variants);
}

const productswithhighesprices = async (req, res) => {
    const variants = await Variants.aggregate([
        {
            $sort: {
                price: -1
            }
        },
        {
            $group: {
                _id: "$product_id",
                highestPrice: { $max: "$price" },
                variants: {
                    $push: {
                        variant_id: "$_id",
                        price: "$price",
                        stock: "$stock",
                        discount: "$discount",
                        attributes: "$attributes"
                    }
                }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                highestPrice: 1,
                variants: 1,
                "productDetails.name": 1,
                "productDetails.description": 1
            }
        },
        {
            $sort: {
                highestPrice: -1
            }
        }
    ])

    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })

    console.log(variants);
}

const morethanonevariant = async (req, res) => {
    const variants = await Variants.aggregate([
        {
            $group: {
                _id: "$product_id",
                variantCount: { $sum: 1 },
                variants: {
                    $push: {
                        variant_id: "$_id",
                        price: "$price",
                        stock: "$stock",
                        discount: "$discount",
                        attributes: "$attributes"
                    }
                }
            }
        },
        {
            $match: {
                variantCount: { $gt: 1 }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails"
        },
        {
            $project: {
                _id: 0,
                productId: "$_id",
                variantCount: 1,
                variants: 1,
                "productDetails.name": 1,
                "productDetails.description": 1
            }
        }
    ])

    res.status(200).json({
        success: true,
        message: "variant get  succesfully",
        data: variants
    })

    console.log(variants);
}


module.exports = {
    getVariant,
    listVariants,
    addVariant,
    deleteVariant,
    updateVariant,
    countstock,
    activevarint,
    countptoduct,
    variantparticularproduct,
    Variantdetails,
    productslowstock,
    productswithhighesprices,
    morethanonevariant
}



