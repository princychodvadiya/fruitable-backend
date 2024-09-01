const express = require('express');
const { controllerOrder } = require('../../../controller');

const router = express.Router();

router.get(
    '/get-order/:order_id',
    controllerOrder.getOrder
)
router.get(
    '/list-order',
    controllerOrder.listOrder
)
router.put(
    '/update-order/:order_id',
    controllerOrder.updateOrder
)

router.post(
    '/add-order',
    controllerOrder.addOrder
)

router.delete(
    '/delete-order/:order_id',
    controllerOrder.deleteorders
)

module.exports = router;