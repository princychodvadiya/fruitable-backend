const sendOTP = (req, res, next) => {
    try {
        const accountSid = process.env.TWILIOOTP_ACCOUNTSID;
        const authToken = process.env.TWILIOOTP_AUTHTOKEN;
        const client = require('twilio')(accountSid, authToken);

        const otp = Math.floor(1000 + Math.random() * 9000);

        req.session.otp = otp;
        client.messages
            .create({
                body: otp,
                from: process.env.TWILIO_OTP_PHONENUM,
                to: '+916354757272'
            })
            .then(message => next())
    } catch (error) {
        console.log(error);
    }
}

const verifyOTP = (req, res, next) => {
    console.log("Verify OTP for session: ", req.session.otp);

    if (req.body.otp === req.session.otp) {
        next();
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
}

module.exports = {
    sendOTP,
    verifyOTP
}

// F6MXWJG9V4FDGAHTQ1T8MXP9