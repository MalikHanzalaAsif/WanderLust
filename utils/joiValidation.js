const joi = require('joi');

// LISTING SCHEMA VALIDATION
module.exports.listingValidate = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("",null),
    price: joi.number().required(),
    location: joi.string().required(),
    country: joi.string().required()
});

// REVIEW SCHEMA VALIDATION
module.exports.reviewValidate = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }).required()
});

