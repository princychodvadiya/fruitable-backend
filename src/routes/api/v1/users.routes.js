const express = require('express');
const { controllerUsers } = require('../../../controller');
const passport = require('passport');
const exportpdfmake = require('../../../utils/pdfmake');
const { sendOTP, verifyOTP } = require('../../../utils/twilioOTP');
const upload = require('../../../middleware/upload');
const { AccRefToken } = require('../../../controller/users.controller');

const router = express.Router();

router.get(
    '/get-user/:user_id',
    controllerUsers.getUser
)

router.post(
    '/register',
    upload.single('avtar'),
    controllerUsers.register
)

router.post(
    '/registerverifyOTP',
    // sendOTP,
    controllerUsers.registerverifyOTP
)

// router.get(
//     '/verifyOTP',
//     verifyOTP,
//     controllerUsers.registerverifyOTP
// )

router.post(
    '/login',
    controllerUsers.login
)

router.post(
    '/generateNewTokens',
    controllerUsers.newToken
)

router.get(
    '/chackAuth',
    controllerUsers.chackAuth
)

router.post(
    '/logout',
    controllerUsers.logout
)

router.get(
    '/googlelogin',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async function (req, res) {

        console.log("Successful");
        console.log(req.isAuthenticated());
        console.log(req.session);
        console.log("iojoihn");
        // Successful authentication, redirect home.
        // res.send('<h1>ok</h1>');
        if (req.isAuthenticated()) {

            const { AccessToken, RefreshToken } = await AccRefToken(req.session.passport.user._id);
            console.log(AccessToken, RefreshToken);

            // const newdataf = await Users.findById({ _id: user._id }).select("-password -RefreshToken");

            const optionAcc = {
                httpOnly: true,
                secure: true,
                maxAge: 360000, // 1 hour
                sameSite: "None"
            }

            const optionRef = {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
            }

            return res.status(200)
                .cookie("AccessToken", AccessToken, optionAcc)
                .cookie("RefreshToken", RefreshToken, optionRef)
                .redirect("http://localhost:3000/")
        }
    });

router.get(
    '/facebooklogin',
    passport.authenticate('facebook')
);

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log("Successful");
        res.send('<h1>ok</h1>');
    });

router.get(
    '/pdfmake',
    exportpdfmake
)

router.get(
    '/order/:user_id',
    controllerUsers.orderofuser
)

router.get(
    '/list-user',
    controllerUsers.listUser
)

router.put(
    '/update-user/:user_id',
    controllerUsers.updateUser
)

router.delete(
    '/delete-user/:user_id',
    controllerUsers.deleteUser
)

router.get(
    '/review/:user_id',
    controllerUsers.reviewofuser
)

router.get(
    '/metch-user',
    controllerUsers.metchUserData
)

router.post(
    '/forgot-password',
    controllerUsers.forgotPassword
);

router.post(
    '/validate-otp',
    controllerUsers.validateOtp
);

router.post(
    '/reset-password',
    controllerUsers.resetPassword
);

router.put(
    '/update-profile/:user_id',
    upload.single('avtar'),
    controllerUsers.updateUserProfile
)

module.exports = router;


