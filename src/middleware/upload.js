const multer = require('multer');
const fs = require('fs');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file.fieldname);
        // const filepath = path.join('public', file.fieldname)
        const filepath = path.join('/tmp', file.fieldname)
        console.log("ok", filepath);

        fs.mkdir(filepath, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
        })
        cb(null, filepath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = upload;

