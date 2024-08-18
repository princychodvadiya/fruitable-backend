const Joi = require("joi");
const pike = require("../helpers/pike");

const validation = (schema) => (req, res, next) => {
    // console.log(req);
    // console.log(Object.keys(schema));

    const object = pike(req, Object.keys(schema));
    console.log(object);

    const { error, value } = Joi.compile(schema)
        .prefs({
            abortEarly: false
        })
        .validate(object);

    console.log(error, value);

    if (error) {
        const errMsg = error.details.map((v) => v.message).join(", ")

        return next(new Error("validate erorr:" + errMsg));
    }
    Object.assign(req, value);
    next();

}

module.exports = {
    validation
}