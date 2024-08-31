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

const addVariant = async (req, res) => {

    try {
        const variant = await Ratinges.create({ ...req.body });
        if (!variant) {
            res.status(400).json({
                success: true,
                message: "failed to added variant",
                data: variant,
            });
        }
        res.status(201).json({
            success: true,
            message: "variant added successfully",
            data: variant,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};
module.exports = {
    listRating,
    addVariant
}
