const Payments = require("../model/payments.model");


const listPayments = async (req, res) => {
    try {
        const payment = await Payments.find();

        if (!payment || payment.length === 0) {
            res.status(404).json({
                success: false,
                meassage: 'payment not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'payment fetch successfully.',
            data: payment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const getPaymentsOrder = async (req, res) => {

    try {
        const payment = await Payments.findById(req.params.payment_id)

        if (!payment) {
            res.status(404).json({
                success: false,
                message: 'payment not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'payment fetch successfully.',
            data: payment
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const creatPayment = async (req, res) => {
    try {
        const payment = await Payments.create(req.body);

        if (!payment) {
            res.status(400).json({
                success: false,
                message: 'payment not created.'
            })
        }

        res.status(201).json({
            success: true,
            message: 'payment created successfully.',
            data: payment
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

module.exports = {
    listPayments,
    getPaymentsOrder,
    creatPayment
}