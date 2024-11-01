const express = require('express');
const app = express();
const router = express.Router({mergeParams: true});
const asyncWrap = require('../utils/asyncWrap.js');
const expressError = require('../utils/expressError.js');
const { reviewValidate } = require('../utils/joiValidation.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isReviewOwner } = require('../utils/middlewares.js');
const reviewController = require('../controllers/review.js');

// REVIEW VALIDATION FUNCTION
const reviewValidateFunc = (req, res, next) => {
    // Perform Joi validation
    const { error } = reviewValidate.validate(req.body);

    // If there's a validation error, throw an Express error
    if (error) {
        throw new expressError(400, error.message);
    } else {
        // Call next middleware if validation passes
        next();
    }
};


// Routes

router.route('/')
// Create Form Route
.get(isLoggedIn ,reviewController.createForm)
// Create Reviews
.post(isLoggedIn ,reviewValidateFunc , asyncWrap(reviewController.create));

router.route('/:reviewId')
// Delete Review
.delete(isLoggedIn , isReviewOwner ,asyncWrap(reviewController.delete))
// Update Review Form
.get(isLoggedIn, isReviewOwner, asyncWrap(reviewController.updateForm))
// Update
.patch(isLoggedIn, isReviewOwner, asyncWrap(reviewController.update));



module.exports = router;