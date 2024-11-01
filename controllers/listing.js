const Listing = require('../models/listing');
const expressError = require('../utils/expressError');
const {names,values} = require('../utils/category');

// INDEX
module.exports.index = async (req,res) => {
    let allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
};

// CREATE FORM
module.exports.createForm = (req,res) => {
    res.render('listings/create.ejs',{names,values});
};

// CREATE
module.exports.create = async (req,res,next) => {
    let image;
    let {title,description,price,location,country,category} = req.body;
    if(req.file){
        image =  {
            url: req.file.path,
            fileName: req.file.originalname
        }
    }
    let newListing = {
        title,
        description,
        price,
        location,
        country,
        image,
        category
    };

     // get coordinates
   let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${process.env.OPENCAGE_API_KEY}`)
   let apiData = await response.json();
   let geometry;
   if (apiData.results.length > 0) {
       // Get the coordinates of the first result
       let { lng, lat } = apiData.results[0].geometry;
       geometry = {
        type: "Point",
        coordinates: [
            lng,
            lat
        ]
       }
   } else{
    return next(new expressError(400,"invalid location! please try another spot."))
   }
   let data = new Listing(newListing);
   data.owner = req.user._id;
   data.geometry = geometry;
   let savedListing = await data.save();
   req.flash('success',"new listing added");
   res.redirect(`/listings/${data._id}`);
};

// READ
module.exports.read = async (req,res) => {
    let {id} = req.params;

    let data = await Listing.findById(id).populate({
        path: 'reviews',
        populate: {path: 'owner'}
    })
    .populate('owner');
    
    if(!data){
        req.flash('error',"listing dosen't exist!");
        res.redirect('/listings');
        return;
    }

    res.render('listings/read.ejs', {data});
};

// UPDATE FORM
module.exports.updateForm = async (req,res) => {
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash('error',"listing dosen't exist!");
        res.redirect('/listings');
        return;
    }
    res.render('listings/update.ejs',{data});
};

// UPDATE
module.exports.update = async (req,res,next) => {
    let image;
    let {id} = req.params;
    let newData = {...req.body.listing};
    if(req.file){
        image =  {
            url: req.file.path,
            fileName: req.file.originalname
        }
        newData.image = image;
    }
     // get coordinates
   let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(newData.location)}&key=${process.env.OPENCAGE_API_KEY}`)
   let apiData = await response.json();
   let geometry;
   if (apiData.results.length > 0) {
       // Get the coordinates of the first result
       let { lng, lat } = apiData.results[0].geometry;
       geometry = {
        type: "Point",
        coordinates: [
            lng,
            lat
        ]
    }
    newData.geometry = geometry;
   } else{
    return next(new expressError(400,"invalid location! please try another spot."))
   }
    await Listing.findByIdAndUpdate(id,newData);
    req.flash('success',"listing updated!");
    res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.delete = async (req,res) => {
    let {id} = req.params;
    let response = await Listing.findByIdAndDelete(id);
    req.flash()
    req.flash('success',"listing deleted!");
    res.redirect(`/listings/user/${response.owner}`);
};

// USER LISTINGS
module.exports.userListings = async (req,res,next) => {
    let { userId } = req.params;
    let userListings = await Listing.find({owner: userId});
    if(userListings.length === 0){
        req.flash("error","you currently don't have any listing!");
        return res.redirect('/listings');
    };
    res.render('listings/userListings.ejs',{userListings});
};

// CATEGORY
module.exports.category = async (req,res) => {
    let category = req.params.category;
    let listings = await Listing.find({category: category});
    if(!listings || listings.length === 0){
        req.flash('error',`no listings found for ${category}!`);
        return res.redirect('/listings');
    }
    res.render('listings/category.ejs',{listings: listings});
};

// SEARCH
module.exports.search = async (req,res) => {
    let {location} = req.query;
    let listings = await Listing.find({
        $or: [
            { title: { $regex: location, $options: 'i' } },
            { country: { $regex: location, $options: 'i' } },
            { location: { $regex: location, $options: 'i' } }
        ]
    });
    if(listings.length === 0){
        req.flash('error',`no results found for "${location}"! try different keywords.`);
        return res.redirect('/listings');
    }
    res.render('listings/search.ejs',{query: location, listings});
};