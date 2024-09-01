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

router.get(
    '/order/:order_id',
    controllePayments.Paymentdetailsorder
)
router.delete(
    '/delete-payment/:payment_id',
    controllePayments.deletepayment
)

router.put(
    '/update-payment/:payment_id',
    controllePayments.updatepayment
)

module.exports = router;