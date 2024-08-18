var nodemailer = require('nodemailer');
const path = require('path');

const sendMail = () => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chodvadiyaprinci@gmail.com',
            pass: process.env.SENDMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'chodvadiyaprinci@gmail.com',
        to: 'sanjanatalaviya1011@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'demo!!!!',
        // attachments: [
        //     {
        //         filename: 'image',
        //         path: "D:/image.jfif"
        //     }
        // ]
        // attachments: [
        //     {
        //         filename: 'pdf',
        //         path: "D:/final-test--s.pdf"
        //     }
        // ]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendMail }