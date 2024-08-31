const Ratinges = require("../model/ratings.model");

const listRating = async (req, res) => {
    try {
        const Ratinge = await Ratinges.find()

        if (!Ratinge || Ratinge.length === 0) {
            res.status(404).json({
                success: false,
                message: "Ratinge data not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Ratinge data fetched",
            data: Ratinge,
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error" + error.message
        })
    }
}

const addReview = async (req, res) => {

    try {
        const Ratinge = await Ratinges.create({ ...req.body });
        if (!Ratinge) {
            res.status(400).json({
                success: true,
                message: "failed to added Ratinge",
                data: Ratinge,
            });
        }
        res.status(201).json({
            success: true,
            message: "Ratinge added successfully",
            data: Ratinge,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const Ratinge = await Ratinges.findByIdAndDelete(req.params.reviews_id)

        if (!Ratinge) {
            res.status(400).json({
                success: false,
                message: 'Ratinge not deleted.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Ratinge deleted successfully.',
            data: Ratinge
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.message
        })
    }
}

const updateReview = async (req, res) => {
    try {
        const { reviews_id } = req.params;
        const updatedRating = await Ratinges.findByIdAndUpdate(reviews_id, req.body, { new: true, runValidators: true });

        if (!updatedRating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found or not updated.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Rating updated successfully.',
            data: updatedRating
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error: ' + error.message
        });
    }
};


const countProduct = async (req, res) => {
    const Ratinge = await Ratinges.aggregate(
        [
            {
                $group: {
                    _id: "$product_id",
                    review_count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    review_count: -1
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'Ratinge successfully.',
        data: Ratinge
    })
}

const topratedproducts = async (req, res) => {
    const Ratinge = await Ratinges.aggregate(
        [
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product_details"
                }
            },
            {
                $unwind: "$product_details"
            },
            {
                $group: {
                    _id: "$product_id",
                    product_name: { $first: "$product_details.name" },
                }
            },
            {
                $sort: {
                    average_rating: -1
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'Ratinge topratedproducts successfully.',
        data: Ratinge
    })
}
module.exports = {
    listRating,
    addReview,
    deleteReview,
    updateReview, countProduct,
    topratedproducts
}
