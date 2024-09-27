const Orders = require("../model/orders.model")

const getOrder = async (req, res) => {

    try {
        const orders = await Orders.findById(req.params.order_id)

        if (!orders) {
            res.status(404).json({
                success: false,
                message: 'orders not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'orders fetch successfully.',
            data: orders
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const listOrder = async (req, res) => {
    try {
        const order = await Orders.find();

        if (!order || order.length === 0) {
            res.status(404).json({
                success: false,
                meassage: 'order not found.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'order fetch successfully.',
            data: order
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            meassage: 'Internal Server Error.' + error.meassage
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const order = await Orders.findByIdAndUpdate(req.params.order_id, req.body, { new: true, runValidators: true });

        if (!order) {
            res.status(400).json({
                success: false,
                message: 'order not updated.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'order updated successfully.',
            data: order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const addOrder = async (req, res) => {
    try {
        const order = await Orders.create(req.body);
        console.log("ok", order);

        if (!order) {
            res.status(400).json({
                success: false,
                message: 'order not created.'
            })
        }
        res.status(201).json({
            success: true,
            message: 'order created successfully.',
            data: order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error.' + error.message
        })
    }
}

const deleteorders = async (req, res) => {

    try {
        const order = await Orders.findByIdAndDelete(req.params.order_id)

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'order not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'order deleted successfully',
            data: order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal error' + error.message
        })
    }
}

const listorderofuser = async (req, res) => {
    try {
        const orders = await Orders.find({ user_id: req.params.user_id });
        console.log(orders);

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found for this user.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Orders found successfully',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal error: ' + error.message
        });
    }
}

const Cancelorder = async (req, res) => {
    const cancelorders = await Orders.aggregate([
        {
            $match: { status: "cancel" }
        }
    ])
    res.status(200).json({
        success: true,
        message: 'cancelorders successfully.',
        data: cancelorders
    })
}

const orderofproduct = async (req, res) => {

}

const orderofseller = async (req, res) => {
    try {
        const orders = await Orders.find({ seller_id: req.params.seller_id });
        console.log(orders);

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found for this user.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Orders found successfully',
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal error: ' + error.message
        });
    }
}

module.exports = {
    getOrder,
    listOrder,
    updateOrder,
    addOrder, deleteorders,
    listorderofuser,
    Cancelorder,
    orderofproduct,
    orderofseller
}