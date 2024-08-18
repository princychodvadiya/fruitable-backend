const Subcategories = require("../model/subcategories.model")

const listSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategories.find();

        if (!subcategories || subcategories.length === 0) {
            res.status(404).json({
                success: false,
                meassage: 'Subcategories not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Subcategories fetch successfully.',
            data: subcategories
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const getSubcategory = async (req, res) => {

    try {
        const subcategories = await Subcategories.findById(req.params.subcategory_id)

        if (!subcategories) {
            res.status(404).json({
                success: false,
                message: 'SubCategory not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'SubCategory fetch successfully.',
            data: subcategories
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const addSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategories.create(req.body);

        if (!subcategory) {
            res.status(400).json({
                success: false,
                message: 'SubCategory not created.'
            })
        }

        res.status(201).json({
            success: true,
            message: 'SubCategory created successfully.',
            data: subcategory
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategories.findByIdAndDelete(req.params.subcategory_id)

        if (!subcategory) {

            res.status(400).json({
                success: false,
                message: 'SubCategory not deleted.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'SubCategory deleted successfully.',
            data: subcategory
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategories.findByIdAndUpdate(req.params.subcategory_id, req.body, { new: true, runValidators: true });

        if (!subcategory) {
            res.status(400).json({
                success: false,
                message: 'SubCategory not updated.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'SubCategory updated successfully.',
            data: subcategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const getSubcategoryByCtegory = async (req, res) => {
    try {
        const subcategories = await Subcategories.find({ category_id: req.params.category_id })
        console.log(subcategories);

        if (!subcategories) {
            res.status(404).json({
                success: false,
                message: 'SubCategory not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'SubCategory fetch successfully.',
            data: subcategories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const countProducts = async () => {
    console.log("ok");

    const subcategories = await Subcategories.aggregate(
        [
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "subcategory_id",
                    as: "products"
                }
            }
            ,
            {
                $unwind: {
                    path: "$products",
                }
            },
            {
                $group: {
                    _id: "$_id",
                    subcategoryName: { $first: "$name" },
                    CountProducts: {
                        $sum: 1
                    }
                }
            }
        ]
    )
    console.log(subcategories);
}

const listOfSubcategory = async () => {
    console.log("ok");

    const listInacive = await Subcategories.aggregate(
        [
            {
                $match: {
                    "isActive": false
                }
            },
            {
                $project: {
                    _id: 1,
                    "isActive": 1,
                    name: 1
                }
            }
        ]
    )
    console.log(listInacive);
}

module.exports = {
    listSubcategories,
    getSubcategory,
    addSubcategory,
    deleteSubcategory,
    updateSubcategory,
    getSubcategoryByCtegory,
    countProducts,
    listOfSubcategory
}