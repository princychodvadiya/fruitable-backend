const pool = require("../db/mysql");

const getSalespeople = async (req, res) => {
    try {
        const [result, field] = await pool.execute("SELECT * FROM salespeople")
        return result
    } catch (error) {
        console.log(error);
        throw new Error("Error in fetch salespeople.", error)
    }
}

const addSalespeople = async (sname, city, comm) => {
    try {
        const [result] = await pool.execute("INSERT INTO salespeople (sname, city, comm,isActive) VALUES (?, ?, ?,?)", [sname, city, comm, isActive])
        console.log(result);
        // return result;
        return ({ insertId: result.insertId, sname, city, comm })

    } catch (error) {
        console.log(error);
        throw new Error("Error in add salespeople.", error)
    }
}

const deleteSalespeople = async (snum) => {
    try {
        const [result] = await pool.execute("DELETE FROM salespeople WHERE snum=?", [snum])
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Error in delete salespeople.", error)
    }
}

const updateSalespeole = async (sname, city, comm, snum) => {
    try {
        const [result] = await pool.execute("UPDATE salespeople SET sname=?, city=?, comm=? WHERE snum=?", [sname, city, comm, snum])
        console.log(result);
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Error in update salespeople.", error)
    }
}

module.exports = {
    getSalespeople,
    addSalespeople,
    deleteSalespeople,
    updateSalespeole
};
