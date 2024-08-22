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

const countActive = async () => {
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
    ]
    )
    // console.log(category);
}

const countinActive = async () => {
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
    // console.log(category);
}

module.exports = {
    listCategories,
    getCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    countActive,
    countinActive
}