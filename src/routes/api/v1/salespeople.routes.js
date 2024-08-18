const express = require('express');
const { controllerSalsepeople } = require('../../../controller');

const router = express.Router();

router.get(
    '/list-salespeople',
    controllerSalsepeople.listSalespeople
)

router.post(
    '/add-salespeople',
    controllerSalsepeople.AddSalespeople
)

router.delete(
    '/delete-salespeople/:snum',
    controllerSalsepeople.DeleteSalespeople
)

router.put(
    '/update-salespeople/:snum',
    controllerSalsepeople.UpdateSalespeople
)
module.exports = router;