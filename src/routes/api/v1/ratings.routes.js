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

router.get(
    '/product/:product_id',
    Ratingesdata.reviewofproduct
)
router.get(
    '/approve/:reviews_id',
    Ratingesdata.Approvereview
)
router.get(
    '/reject/:reviews_id',
    Ratingesdata.Rejectreview
)

router.get(
    '/user-with-productdata/:user_id',
    Ratingesdata.userwithproductdata
)

router.get(
    '/no-reviews',
    Ratingesdata.NoReviews
)
router.get(
    '/user/:user_id',
    Ratingesdata.submittedbyspecificuser
)

router.get(
    '/with-comments',
    Ratingesdata.includecomments
)

router.get(
    '/get-review/:reviews_id',
    Ratingesdata.getReview
)

module.exports = router