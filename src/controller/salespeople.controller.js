const { Salespeople } = require("../model");
const { getSalespeople, addSalespeople } = require("../model/salespeople.model");

const listSalespeople = async (req, res) => {
    try {
        const salespeople = await Salespeople.getSalespeople();
        // console.log(salespeople);

        res.status(200).json({
            success: true,
            data: salespeople,
            message: 'salespeople fetch successfully.'
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            data: [],
            message: 'Internal server erroe.'
        })
    }
}

const AddSalespeople = async (req, res) => {
    try {
        const { sname, city, comm, isActive } = req.body;
        const salespeople = await Salespeople.addSalespeople(sname, city, comm, isActive);

        res.status(201).json({
            success: true,
            data: salespeople,
            message: 'salespeople add successfully.'
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            data: [],
            message: 'Internal server error.'
        })
    }
}

const DeleteSalespeople = async (req, res) => {
    try {
        const { snum } = req.params;
        const salespeople = await Salespeople.deleteSalespeople(snum);
        console.log(salespeople);

        res.status(200).json({
            success: true,
            data: salespeople,
            message: 'salespeople delete successfully.'
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: 'Internal server error.'
        })
    }
}

const UpdateSalespeople = async (req, res) => {
    try {
        const { snum } = req.params;
        const { sname, city, comm, isActive } = req.body;
        const salespeople = await Salespeople.updateSalespeole(sname, city, comm, snum, isActive);
        // console.log(salespeople);
        if (salespeople.rows > 0) {
            res.status(200).json({
                success: true,
                data: salespeople,
                message: 'Salesperson updated successfully.'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

module.exports = {
    listSalespeople,
    AddSalespeople,
    DeleteSalespeople,
    UpdateSalespeople
}