const Products = require("../model/produts.model");
const uploadFile = require("../utils/cloudinary");

const searchProducts = async (req, res) => {
    try {
        const { sortOrder, rating, max, min, category, page, limit } = req.body

        const metchpip = {}

        if (rating) {
            metchpip['avgRating'] = {
                $gte: rating
            }
        }

        if (category) {
            metchpip['category_id'] = category
        }

        metchpip['variants.attributes.Price'] = {

        }

        if (max != undefined) {
            metchpip['variants.attributes.Price'].$lte = max
        }

        if (min != undefined) {
            metchpip['variants.attributes.Price'].$gte = min
        }

        console.log(metchpip);

        const pipeline = [
            {
                $lookup: {
                    from: "variants",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "variants"
                }
            },
            {
                $lookup: {
                    from: "reviews",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "reviews"
                }
            },
            {
                $addFields: {
                    avgRating: { $avg: "$reviews.rating" }
                }
            },
            {
                $unwind: "$variants"
            },
            {
                $match: metchpip
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    variants: { $push: "$variants" },
                    reviews: { $push: "$reviews" }
                }
            },
            {
                $sort: {
                    name: sortOrder === "acs" ? 1 : -1
                }
            }
        ]

        if (page > 0 && limit > 0) {
            pipeline.push({ $skip: (page - 1) * limit })
            pipeline.push({ $limit: limit })
        }

        const data = await Products.aggregate(pipeline);
        console.log(data);

        res.status(200).json({
            success: true,
            message: 'Product aggregate successfully.',
            data: data
        });

    } catch (error) {
        console.log(error);

    }
}

const listProducts = async (req, res) => {
    try {
        const products = await Products.find();

        if (!products || products.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Products not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Products fetch successfully.',
            data: products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const getProduct = async (req, res) => {

    try {
        const product = await Products.findById(req.params.product_id)
        console.log(product);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'product not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'product fetch successfully.',
            data: product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const addProduct = async (req, res) => {
    console.log(req.body);
    console.log("bhcdb", req.file);

    const fileRes = await uploadFile(req.file.path, "Product");
    console.log(fileRes);

    try {
        const product = await Products.create({
            ...req.body,
            product_image: {
                public_id: fileRes.public_id,
                url: fileRes.url
            }
        });

        if (!product) {
            res.status(400).json({
                success: false,
                message: 'product not created.'
            })
        }

        res.status(201).json({
            success: true,
            message: 'product created successfully.',
            data: product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.product_id)

        if (!product) {

            res.status(400).json({
                success: false,
                message: 'product not deleted.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'product deleted successfully.',
            data: product
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const updateProduct = async (req, res) => {
    // console.log(req.params.product_id, req.body, req.file);
    if (req.file) {
        console.log("New image.");

        try {
            const fileRes = await uploadFile(req.file.path, "Product");
            console.log(fileRes);

            const updatedProductData = {
                ...req.body,
                product_image: {
                    public_id: fileRes.public_id,
                    url: fileRes.url
                }
            };

            const product = await Products.findByIdAndUpdate(req.params.product_id, updatedProductData, { new: true, runValidators: true });

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'Product not updated.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product updated successfully.',
                data: product
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error. ' + error.message
            });
        }
    } else {
        console.log("Old image.");

        try {
            const product = await Products.findByIdAndUpdate(req.params.product_id, req.body, { new: true, runValidators: true });
            console.log(product);

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: 'Product not updated.'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Product updated successfully.',
                data: product
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error. ' + error.message
            });
        }
    }

    // try {
    //     const product = await Products.findByIdAndUpdate(req.params.product_id, req.body, { new: true, runValidators: true });

    //     if (!product) {
    //         res.status(400).json({
    //             success: false,
    //             message: 'product not updated.'
    //         })
    //     }
    //     res.status(200).json({
    //         success: true,
    //         message: 'product updated successfully.',
    //         data: product
    //     })
    // } catch (error) {
    //     res.status(500).json({
    //         success: false,
    //         message: 'Internal Server Error.' + error.message
    //     })
    // }
}

const getProductBySubcategory = async (req, res) => {
    try {
        const product = await Products.find({ product_id: req.params.product_id })
        console.log(product);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'product not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'product fetch successfully.',
            data: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const Countcategory = async (req, res) => {
    console.log("ok");

    const Countcategory = await Products.aggregate(
        [
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",

                }
            },
            {
                $group: {
                    _id: "$category_id",
                    Category_name: { $first: "$category.name" },
                    Product_name: { $first: "$name" },
                    countproduct: {
                        $sum: 1
                    }
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'product fetch successfully.',
        data: Countcategory
    })
    console.log(Countcategory);
}

const outofstock = async (req, res) => {
    console.log("ok");

    const outofstock = await Products.aggregate([
        {
            "$match": {
                "isActive": true
            }
        },
        {
            "$lookup": {
                "from": "variants",
                "localField": "_id",
                "foreignField": "product_id",
                "as": "variants"
            }
        },
        {
            "$match": {
                "variants": { "$size": 0 }
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": 1,
                "description": 1,
                "price": 1,
                "stock": 1
            }
        }
    ]
    )
    res.status(200).json({
        success: true,
        message: 'product fetch successfully.',
        data: outofstock
    })
    console.log(outofstock);
}

const productByCategory = async (req, res) => {
    console.log("ok");
    const productByCategory = await Products.aggregate(
        [
            {
                $lookup: {
                    from: "categories",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "categories"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    category: {
                        $first: "$name"
                    },
                    ProdcutCount: {
                        $sum: 1
                    },
                    product: {
                        $push: "$categories.name"
                    }
                }
            },
            {
                $unwind: "$product"
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'product fetch successfully.',
        data: productByCategory
    })
    console.log(productByCategory);
}

const topRate = async (req, res) => {

    const products = await Products.aggregate([

        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "product_id",
                as: "review"
            }
        },
        {
            $unwind: {
                path: "$review"
            }
        },
        {
            $group: {
                _id: "$_id",
                "product_name": { $first: "$name" },
                "Totalrating": {
                    $sum: "$review.rating"
                }
            }
        },
        {
            $sort: {
                "Totalrating": -1
            }
        },
        {
            $limit: 1
        }

    ])

    res.status(200).json({
        success: true,
        message: "Products get  succesfully",
        data: products
    })

    console.log(products);

}
const newArrivals = async (req, res) => {

    const products = await Products.aggregate([
        {
            $sort: {
                "createdAt": -1
            }
        },
        {
            $limit: 3
        }
    ])

    res.status(200).json({
        success: true,
        message: "Products get  succesfully",
        data: products
    })

    console.log(products);

}

const discounts = async (req, res) => {
    const discounts = await Products.aggregate(
        [
            {
                "$match": {
                    "isActive": true
                }
            },
            {
                "$lookup": {
                    "from": "categories",
                    "localField": "category_id",
                    "foreignField": "_id",
                    "as": "category"
                }
            },
            {
                "$lookup": {
                    "from": "subcategories",
                    "localField": "subcategory_id",
                    "foreignField": "_id",
                    "as": "subcategory"
                }
            },
            {
                "$unwind": "$category"
            },
            {
                "$unwind": "$subcategory"
            },
            {
                "$group": {
                    "_id": {
                        "category_id": "$category_id",
                        "subcategory_id": "$subcategory_id"
                    },
                    "category_name": { "$first": "$category.name" },
                    "subcategory_name": { "$first": "$subcategory.name" },
                    "products": {
                        "$push": {
                            "_id": "$_id",
                            "name": "$name",
                            "description": "$description",
                            "price": "$price",
                            "stock": "$stock"
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "category_id": "$_id.category_id",
                    "subcategory_id": "$_id.subcategory_id",
                    "category_name": 1,
                    "subcategory_name": 1,
                    "products": 1
                }
            }
        ]

    )
    res.status(200).json({
        success: true,
        message: "Products get  succesfully",
        data: discounts
    })
}

const variantsDatils = async (req, res) => {
    const variantsDatils = await Products.aggregate(
        [
            {
                "$lookup": {
                    "from": "variants",
                    "localField": "_id",
                    "foreignField": "product_id",
                    "as": "variants"
                }
            },
            {
                "$unwind": {
                    "path": "$variants",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "description": 1,
                    "price": 1,
                    "stock": 1,
                    "variants": {
                        "_id": "$variants._id",
                        "variant_name": "$variants.name",
                        "variant_price": "$variants.price",
                        "variant_stock": "$variants.stock",
                        "variant_details": "$variants.details"
                    }
                }
            }
        ]

    )
    res.status(200).json({
        success: true,
        message: "Products get  succesfully",
        data: variantsDatils
    })
}

module.exports = {
    listProducts,
    getProduct,
    addProduct,
    deleteProduct,
    updateProduct,
    Countcategory,
    outofstock,
    productByCategory,
    getProductBySubcategory,
    searchProducts,
    topRate,
    newArrivals,
    discounts,
    variantsDatils
}