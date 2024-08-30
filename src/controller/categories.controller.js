const { default: mongoose } = require("mongoose");
const Categories = require("../model/categories.model")

const listCategories = async (req, res) => {
    console.log("cateee", req.query.page, req.query.pageSize);
    try {
        const page = parseInt(req.query.page)
        const pageSize = parseInt(req.query.pageSize)

        if (page <= 0 || pageSize <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid page or page size"
            })
        }

        const categories = await Categories.find();

        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                meassage: 'Categories not found.'
            })
        }

        let startIndex = 0, endIndex = 0, paginationData = [...categories]

        if (page > 0 && pageSize > 0) {
            startIndex = (page - 1) * pageSize        //startIndex=(3-1)*3=3
            endIndex = startIndex + pageSize             //endIndex=3+3=6
            paginationData = categories.slice(startIndex, endIndex)
        }

        res.status(200).json({
            success: true,
            totalData: categories.length,
            message: 'Categories fetch successfully.',
            data: paginationData
        })
        // res.status(200).json({
        //     success: true,
        //     // totalData: categories.length,
        //     message: 'Categories fetch successfully.',
        //     data: categories
        // })
    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const getCategory = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.category_id)

        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Categories fetch successfully.',
            data: category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const addCategory = async (req, res) => {
    console.log("OK", req.body);

    try {
        const category = await Categories.create(req.body);
        console.log(category);

        if (!category) {
            res.status(400).json({
                success: false,
                message: 'Category not created.'
            })
        }

        res.status(201).json({
            success: true,
            message: 'Category created successfully.',
            data: category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findByIdAndDelete(req.params.category_id)

        if (!category) {
            res.status(400).json({
                success: false,
                message: 'Category not deleted.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully.',
            data: category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        console.log("yyyyyyyyyyyyyy", req.params.category_id, req.body);

        const category = await Categories.findByIdAndUpdate(req.params.category_id, req.body, { new: true, runValidators: true });
        console.log("uuu", category);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.'
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const countActive = async (req, res) => {
    // console.log("ok");
    const category = await Categories.aggregate([
        {
            $match: {
                "isActive": true
            }
        },
        {
            $count: 'ActiveCategory'
        }
    ])
    res.status(200).json({
        success: true,
        message: 'ActiveCategory.',
        data: category
    })
    console.log(category);
}

const countinActive = async (req, res) => {
    // console.log("ok");

    const category = await Categories.aggregate(
        [
            {
                $match: {
                    "isActive": false
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'countinActive.',
        data: category
    })
    // console.log(category);
}

const highestnum = async (req, res) => {
    const highestnumproduct = await Categories.aggregate([

        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category_id",
                "as": "products"
            }
        },
        {
            $project: {
                categoryName: "$name",
                productCount: { "$size": "$products" }
            }
        },
        {
            $sort: {
                "productCount": -1
            }
        },
        {
            $limit: 3
        }

    ]);
    res.status(200).json({
        success: true,
        message: "highestnumproduct get  succesfully",
        data: highestnumproduct
    })
    console.log(highestnumproduct);
}

const countsubcategories = async (req, res) => {
    const countsubcategori = await Categories.aggregate([

        {
            $lookup: {
                from: "subcategories",
                localField: "_id",
                foreignField: "category_id",
                as: "Subacategory"
            }
        },
        {
            $project: {
                _id: 1,
                category_name: "$name",
                countsubcategories: { $size: "$Subacategory" }
            }
        }

    ]);
    res.status(200).json({
        success: true,
        message: "countsubcate get succesfully",
        data: countsubcategori
    })
    console.log(countsubcategori);
}

const subcategorioncategories = async (req, res) => {
    const { category_id } = req.params;

    try {
        const retviecategoryonsubcate = await Categories.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(category_id)  // Match the category_id from the request
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "category_id",
                    as: "subcategories"
                }
            },
            {
                $project: {
                    _id: 1,
                    category_name: "$name",
                    subcategories: "$subcategories"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: "Subcategories retrieved successfully.",
            data: retviecategoryonsubcate[0]  // Assuming you expect a single category
        });

        console.log(retviecategoryonsubcate);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while retrieving subcategories.",
            error: error.message
        });
    }
};

const totalProduct = async (req, res) => {
    try {
        const count = await Categories.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "category_id",
                    as: "Products"
                }
            },
            {
                $unwind: {
                    path: "$Products"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    category_name: { $first: "$name" },
                    totalProduct: {
                        $sum: 1
                    }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: "Inactive category count",
            data: count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

module.exports = {
    listCategories,
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    countActive,
    countinActive,
    highestnum,
    countsubcategories,
    subcategorioncategories,
    totalProduct
}