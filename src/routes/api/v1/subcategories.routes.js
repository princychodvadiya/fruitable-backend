const express = require('express');
const { controllerSubcategories } = require('../../../controller');

const router = express.Router();

router.get(
    '/get-subcategories/:subcategory_id',
    controllerSubcategories.getSubcategory
)
router.get(
    '/list-subcategories',
    controllerSubcategories.listSubcategories
)

router.post(
    '/add-subcategory',
    controllerSubcategories.addSubcategory
)

router.put(
    '/update-subcategory/:subcategory_id',
    controllerSubcategories.updateSubcategory
)

router.delete(
    '/delete-subcategory/:subcategory_id',
    controllerSubcategories.deleteSubcategory
)

router.get(
    '/get-subcategoryBycategory/:subcategory_id',
    controllerSubcategories.getSubcategoryByCtegory
)

router.get(
    '/count-products',
    controllerSubcategories.countProducts
)

router.get(
    '/inactive',
    controllerSubcategories.listOfSubcategory
)

router.get(
    '/parent-of-subcategory/:category_id',
    controllerSubcategories.subcategorioncategory
)

router.get(
    '/most-products',
    controllerSubcategories.highestcategori
)

router.get(
    '/count-active',
    controllerSubcategories.activesubcategory
)

module.exports = router;


