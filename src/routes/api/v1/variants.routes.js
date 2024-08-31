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

router.get(
    '/count-stock/:variant_id',
    controllerVariants.countstock
)

router.get(
    '/active',
    controllerVariants.activevarint
)

router.get(
    '/count-products',
    controllerVariants.countptoduct
)

router.get(
    '/product/:product_id',
    controllerVariants.variantparticularproduct
)

router.get(
    '/list-variant/:product_id',
    controllerVariants.Variantdetails
)

router.get(
    '/low-quantity',
    controllerVariants.productslowstock
)
router.get(
    '/high-price',
    controllerVariants.productswithhighesprices
)
router.get(
    '/multiple-variants',
    controllerVariants.morethanonevariant
)
module.exports = router;


