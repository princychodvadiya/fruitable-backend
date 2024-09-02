const express = require('express');
const { controlleCarts } = require('../../../controller');
const router = express.Router();

router.get(
    '/get-cart/:cart_id',
    controlleCarts.getcartUser
)

router.put(
    '/update-cart/:cart_id',
    controlleCarts.updatecart
)

router.put(
    '/update-quantity/:cart_id',
    controlleCarts.updatequantity
)

router.post(
    '/add-to-cart',
    controlleCarts.addCart
)
module.exports = router;