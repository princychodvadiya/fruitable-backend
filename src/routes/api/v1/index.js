const express = require('express');

const router = express.Router();

const categoriesRouter = require('./categories.routes');
const subcategoriesRouter = require('./subcategories.routes');
const productsRouter = require('./products.routes');
const variantsRouter = require('./variants.routes');
const salespeopleRouter = require('./salespeople.routes');
const usersRouter = require('./users.routes')
const ratinges = require('./ratings.routes')
const ordersRouter = require('./orders.routes')
const paymentsRouter = require('./payments.routes')

router.use('/categories', categoriesRouter);
router.use('/subcategories', subcategoriesRouter);
router.use('/products', productsRouter);
router.use('/variants', variantsRouter);
router.use('/salespeoples', salespeopleRouter);
router.use('/users', usersRouter);
router.use("/reviews", ratinges);
router.use("/orders", ordersRouter);
router.use("/payments", paymentsRouter)

module.exports = router;
