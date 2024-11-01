const express = require('express');
const router = express.Router();
const asyncWrap = require('../utils/asyncWrap.js');
const expressError = require('../utils/expressError.js');
const { listingValidate } = require('../utils/joiValidation.js');
const Listing = require('../models/listing.js');
const {isLoggedIn, isListingOwner} = require('../utils/middlewares.js');
const listingController = require('../controllers/listing.js');
const { storage } = require('../utils/cloudConfig.js')
const multer = require('multer');
// Create a multer instance with a limit on file size
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit per file
    }
});

// LISTING VALIDATE FUNCTION
// const listingValidateFunc = (req,res,next) => {
//     // joi validation
//     const result = listingValidate.validate(req.body);
//     if(result.error){
//         throw new expressError(400,result.error.message);
//     } else{
//         next();
//     };
// };


// R O U T E S

router.route('/')
// INDEX ROUTE  
.get(asyncWrap(listingController.index))
//CREATE ROUTE
.post( isLoggedIn,  upload.single('image'), asyncWrap(listingController.create));


// CREATE ROUTE FORM
router.get('/new', isLoggedIn , listingController.createForm);

// Search Route
router.get('/search', asyncWrap(listingController.search));


router.route('/:id')
// READ ROUTE
.get(asyncWrap(listingController.read))
// UPDATE ROUTE
.put( isLoggedIn ,isListingOwner , upload.single('image') ,asyncWrap(listingController.update))
// DELETE ROUTE
.delete(isLoggedIn , isListingOwner ,asyncWrap(listingController.delete));



// UPDATE ROUTE FORM
router.get('/:id/edit', isLoggedIn , isListingOwner ,asyncWrap(listingController.updateForm));

// Show User's Listings
router.get('/user/:userId', isLoggedIn , asyncWrap(listingController.userListings));

// Category Listings Route
router.get('/category/:category', asyncWrap(listingController.category));


module.exports = router;