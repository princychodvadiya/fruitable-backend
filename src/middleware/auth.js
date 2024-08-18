var jwt = require('jsonwebtoken');
const Users = require('../model/users.model');

const auth = (roles = []) => async (req, res, next) => {
    try {
        const token = req.cookies.AccessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is require."
            })
        }

        try {
            const validateToken = await jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
            const user = await Users.findById(validateToken._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "user is not found."
                })
            }
            if (!roles.some((v) => v === user.role)) {
                return res.status(400).json({
                    success: false,
                    message: "You have not accses." + error.message
                })
            }
            req.user = user

            next()
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "invalid token." + error.message
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal sever error." + error.message
        })
    }
}

module.exports = auth;