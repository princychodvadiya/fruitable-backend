const express = require('express');
const { controllePayments } = require('../../../controller');
const router = express.Router();

router.get(
    '/list-payment',
    controllePayments.listPayments
)

router.get(
    '/get-payment/:payment_id',
    controllePayments.getPaymentsOrder
)

router.post(
    '/create-payment',
    controllePayments.creatPayment
)
module.exports = router;