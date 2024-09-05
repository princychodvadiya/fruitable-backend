const mongoose = require("mongoose");
const Ratinges = require("../model/ratings.model");
const { ObjectId } = require('mongodb');
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
                $sort: {
                    "totalratinges": -1
                }
            }, {
                $limit: 1
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'Ratinge topratedproducts successfully.',
        data: Ratinge
    })
}

const reviewofproduct = async (req, res) => {
    const { product_id } = req.params;

    try {
        const reviews = await Ratinges.aggregate([
            {
                $match: {
                    product_id: mongoose.Types.ObjectId(product_id)
                }
            }
        ]);
        res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully.',
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching reviews.',
            error: error.message
        });
    }
}

const Approvereview = async (req, res) => {
    try {
        const { reviews_id, status } = req.params; 

        const isApproved = status === 'approve' ? true : status === 'disapprove' ? false : null;

        if (isApproved === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Use "approve" or "disapprove".'
            });
        }

        const result = await Ratinges.updateOne(
            { _id: new mongoose.Types.ObjectId(reviews_id) }, 
            { $set: { isApproved: isApproved } } 
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: "Review successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the review status.',
            error: error.message
        });
    }
};

const Rejectreview = async (req, res) => {
    try {
        const userId = req.params.user_id;

        const objectId = mongoose.Types.ObjectId(userId);

        const reviews = await Ratinges.aggregate([
            {
                $match: {
                    user_id: objectId,
                    isApproved: false
                }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully.',
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching reviews.',
            error: error.message
        });
    }
}

const userwithproductdata = async (req, res) => {
    const { user_id } = req.params;
    const reviews = await Ratinges.aggregate([
        {
            $match: {
                user_id: new mongoose.Types.ObjectId(user_id)
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product_id',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        {
            $unwind: {
                path: '$productDetails',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                user_id: 1,
                rating: 1,
                review: 1,
                'productDetails._id': 1,
                'productDetails.name': 1,
                'productDetails.description': 1 // Include any other product fields as needed
            }
        }
    ])
    res.status(200).json({
        success: true,
        message: 'Ratinge topratedproducts successfully.',
        data: reviews
    })
}

const NoReviews = async (req, res) => {
    const reviews = await Ratinges.aggregate(
        [
            {
                $lookup: {
                    from: 'review',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'review'
                }
            },
            {
                $match: {
                    review: { $size: 0 }
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'Reviews fetched successfully.',
        data: reviews
    });
}

const submittedbyspecificuser = async (req, res) => {
    try {
        const userId = req.params.user_id;

        // Convert user_id to ObjectId if necessary
        const reviews = await Ratinges.aggregate([
            {
                $match: {
                    user_id: mongoose.Types.ObjectId(userId) // Assuming user_id is an ObjectId in MongoDB
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully.',
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching reviews.',
            error: error.message
        });
    }
};

const includecomments = async (req, res) => {
    const review = await Ratinges.aggregate(
        [
            {
                "$match": {
                    "comment": {
                        "$exists": true,
                        "$ne": ""
                    }
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: 'review fetch successfully.',
        data: review
    })
}

const getReview = async (req, res) => {

    try {
        const review = await Ratinges.findById(req.params.reviews_id)

        if (!review) {
            res.status(404).json({
                success: false,
                message: 'review not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'review fetch successfully.',
            data: review
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}


module.exports = {
    listRating,
    addReview,
    deleteReview,
    updateReview, countProduct,
    topratedproducts,
    reviewofproduct,
    Approvereview,
    Rejectreview,
    userwithproductdata, NoReviews,
    submittedbyspecificuser,
    includecomments,
    getReview
}
