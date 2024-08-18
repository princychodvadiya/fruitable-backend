
const pike = (object, keys) => {

    return keys.reduce((obj, k) => {
        if (object && object.hasOwnProperty(k)) {
            obj[k] = object[k]
        }
        return obj
    }, {})
}

module.exports = pike