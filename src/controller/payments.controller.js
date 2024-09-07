const Payments = require("../model/payments.model");

const listPayments = async (req, res) => {
    try {
        const payment = await Payments.find();
        console.log("pppp", payment);

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

const Paymentdetailsorder = async (req, res) => {
    const payment = await Payments.aggregate(
        [
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "paymentDetails"
                }
            },
            {
                $unwind: {
                    path: "$paymentDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    order_id: 1,
                    gateway: "$paymentDetails.gateway",
                    status: "$paymentDetails.status",
                }
            }
        ]
    )
    res.status(200).json({
        success: true,
        message: "payment get  succesfully",
        data: payment
    })
}
const deletepayment = async (req, res) => {
    // console.log(req.params.categori_id);
    try {
        const payments = await Payments.findByIdAndDelete(req.params.payment_id)
        console.log(payments);

        if (!payments) {
            res.status(404).json({
                success: false,
                message: 'payments not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'payments deleted successfully',
            data: payments
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal error' + error.message
        })
    }
}

const updatepayment = async (req, res) => {
    console.log("ddddddddddddddddddddd", req.params.payment_id, req.body);
    try {
        const payments = await Payments.findByIdAndUpdate(req.params.payment_id, req.body, { new: true, runValidators: true })
        console.log(payments);

        if (!payments) {
            return res.status(400).json({
                success: false,
                message: 'payments not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'payments update successfully',
            data: payments
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal error' + error.message
        })
    }
}

module.exports = {
    listPayments,
    getPaymentsOrder,
    creatPayment,
    Paymentdetailsorder, deletepayment,
    updatepayment
}