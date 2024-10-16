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
    controlleCarts.AddTOCart
)

router.delete(
    '/delete-cart/:cart_id/:product_id',
    controlleCarts.deleteCartItem
);

router.get(
    '/listcart',
    controlleCarts.ListCart
)

router.put(
    '/update-quantity/:cart_id',
    controlleCarts.updatequantity
);

router.put(
    '/decrement-quantity/:cart_id',
    controlleCarts.decrementQuantity
);

router.get(
    '/get-user/:user_id',
    controlleCarts.getUser
)

router.delete(
    '/delete-cart/:cart_id',
    controlleCarts.DeleteCart
)

module.exports = router;