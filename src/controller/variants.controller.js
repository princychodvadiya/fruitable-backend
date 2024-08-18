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

module.exports = {
    getVariant,
    listVariants,
    addVariant,
    deleteVariant,
    updateVariant
}