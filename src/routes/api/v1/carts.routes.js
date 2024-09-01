const express = require('express');
const { controlleCarts } = require('../../../controller');
const router = express.Router();

router.delete(
    '/update-cart/:cart_id',
    controlleCarts.updatecart
)


module.exports = router;