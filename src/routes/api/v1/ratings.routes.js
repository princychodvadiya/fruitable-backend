const express = require("express");
const { Ratingesdata } = require("../../../controller");

const router = express.Router();

router.get(
    "/list-rating",
    Ratingesdata.listRating
)

router.post(
    "/create-review",
    Ratingesdata.addReview
)

router.delete(
    "/delete-review/:reviews_id",
    Ratingesdata.deleteReview
)

router.put(
    "/update-review/:reviews_id",
    Ratingesdata.updateReview
)

router.get(
    '/count-products',
    Ratingesdata.countProduct
)

router.get(
    '/top-rated-products',
    Ratingesdata.topratedproducts
)

module.exports = router