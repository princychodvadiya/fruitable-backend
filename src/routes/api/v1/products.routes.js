const express = require('express');
const { controllerProducts } = require('../../../controller');
const upload = require('../../../middleware/upload');

const router = express.Router();

router.get(
    '/search',
    controllerProducts.searchProducts
)
router.get(
    '/get-product/:product_id',
    controllerProducts.getProduct
)

router.get(
    '/list-product',
    controllerProducts.listProducts
)

router.post(
    '/add-product',
    upload.single('product_image'),
    controllerProducts.addProduct
)

router.put(
    '/update-product/:product_id',
    upload.single('product_image'),
    controllerProducts.updateProduct
)

router.delete(
    '/delete-product/:product_id',
    controllerProducts.deleteProduct
)

router.get(
    '/count-categories',
    controllerProducts.Countcategory
)

// router.get(
//     '/out-of-stock',
//     controllerProducts.outofstock
// )

router.get(
    '/category',
    controllerProducts.productByCategory
)

router.get(
    '/get-ProductBySubcategory/:subcategory_id',
    controllerProducts.getProductBySubcategory
)

module.exports = router;