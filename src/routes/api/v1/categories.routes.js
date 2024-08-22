const express = require('express');
const { controllerCategories } = require('../../../controller');
const auth = require('../../../middleware/auth');
const { creatCategory } = require('../../../validation/category.validation');
const { categoryValidation } = require('../../../validation');
const { validation } = require('../../../middleware/validation');

const router = express.Router();

router.get(
    '/get-categories',                  //categoryValidation api
    // '/get-categories/:category_id',    //get categoty api
    validation(categoryValidation.getCategory),
    controllerCategories.getCategory
)

router.get(
    '/list-categories',
    // auth(["admin", "employe", "user"]),
    controllerCategories.listCategories
)

router.post(
    '/add-category',
    validation(categoryValidation.creatCategory),
    controllerCategories.addCategory
)

router.put(
    '/update-category/:category_id',
    validation(categoryValidation.updateCategory),
    controllerCategories.updateCategory
)

router.delete(
    '/delete-category/:category_id',
    validation(categoryValidation.deleteCategory),
    controllerCategories.deleteCategory
)
router.get(
    '/getActive',
    controllerCategories.countActive
)

router.get(
    '/getInactive',
    controllerCategories.countinActive
)

module.exports = router;    