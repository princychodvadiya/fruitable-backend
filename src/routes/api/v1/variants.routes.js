const express = require('express');
const { controllerVariants } = require('../../../controller');
const upload = require('../../../middleware/upload');

const router = express.Router();

router.get(
    '/get-variant/:variant_id',
    controllerVariants.getVariant
)

router.get(
    '/list-variants',
    controllerVariants.listVariants
)

router.post(
    '/add-variant',
    upload.single('variant_image'),
    controllerVariants.addVariant
)
router.put(
    '/update-variant/:variant_id',
    upload.single('variant_image'),
    controllerVariants.updateVariant
)

router.delete(
    '/delete-variant/:variant_id',
    controllerVariants.deleteVariant
)

module.exports = router;


