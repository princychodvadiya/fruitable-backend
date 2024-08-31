const express = require("express");
const { Ratingesdata } = require("../../../controller");

const router = express.Router();

router.get(
    "/list-rating",
    Ratingesdata.listRating
)

router.post("/addVariant",
    Ratingesdata.addVariant
)
module.exports = router