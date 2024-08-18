const express = require('express');

const router = express.Router();

const categoriesRouter = require('./categories.routes');
const subcategoriesRouter = require('./subcategories.routes');
const productsRouter = require('./products.routes');
const variantsRouter = require('./variants.routes');
const salespeopleRouter = require('./salespeople.routes');
const usersRouter = require('./users.routes')

router.use('/categories', categoriesRouter);
router.use('/subcategories', subcategoriesRouter);
router.use('/products', productsRouter);
router.use('/variants', variantsRouter);
router.use('/salespeoples', salespeopleRouter);
router.use('/users', usersRouter)


module.exports = router;
