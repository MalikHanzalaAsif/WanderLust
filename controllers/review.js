const Review = require('../models/review');
const Listing = require('../models/listing');

// CREATE FORM 
module.exports.createForm = (req,res) => {
    let id = req.params.id;
    res.render('reviews/createReview.ejs',{id});
};

// CREATE
module.exports.create = async (req,res) => {
    let listingId = req.params.id;
    let listing = await Listing.findById(listingId);
    let review = req.body.review;
    let newReview = new Review(review);
    listing.reviews.push(newReview._id);
    newReview.owner = req.user._id;

    await listing.save();
    await newReview.save();
    req.flash('success',"new review added!");
    res.redirect(`/listings/${listingId}`);
};

// DELETE
module.exports.delete = async (req,res) => {
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{ $pull : { reviews : reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"review deleted!");
    res.redirect(`/listings/${id}`);
};

// UPDATE FORM
module.exports.updateForm = async(req,res) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        req.flash('error',"this review dosen't exist!");
        return res.redirect(`/listings/${id}`);
    }
    res.render('reviews/updateReview.ejs',{review,id});
};

// UPDATE
module.exports.update = async (req,res) => {
    let {id,reviewId} = req.params;
    let {comment,rating} = req.body.review;
    let newReview = await Review.findByIdAndUpdate(reviewId,{comment,rating},{new: true});
    req.flash('success',"review updates successfully!");
    res.redirect(`/listings/${id}`);
};