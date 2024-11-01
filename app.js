if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// required packages and other variables
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 8080;
const dbUrl = process.env.ATLASDB_URL;
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const expressError = require('./utils/expressError.js');
const MongoStore = require('connect-mongo');

// database connection
async function main(){
    await mongoose.connect(dbUrl);
};
main()
.then(()=>{
    console.log('succesfully connected to mongostlas database!')
})
.catch((err)=>{
    console.log(`Cant connect to database ${err}`);
});

// middlewares
// configuring ejs and its path to "views";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

// For parsing the urlencoded data of post req body;
app.use(express.urlencoded({extended : true}))

// Override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

// SET EJS-MATE TO ENGINE
app.engine('ejs',ejsMate)

// for setting public as the directory for static files;
app.use(express.static(path.join(__dirname,"public")));

// For parsing the json data of post req body;
app.use(express.json())

// Serve the uploads folder as static to access uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Using connect-flash
app.use(flash());

// Using connect-mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

// Using Express Session
app.use(session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000), // Set expiration to 7 days from now
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

// User Authentication Middlewares using passport,passport-local and passport-local-mongoose
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// ROUTES
app.use('/listings',listingRoutes);
app.use('/listings/:id/review',reviewRoutes);
app.use('/',userRoutes);


// UNKNOWN PATH ERROR MIDDLEWARE
app.all("*",(req,res,next) => {
    next(new expressError(404,"page not found!"));
});

// ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next) => {
    if (err.name === 'ValidationError') {
        // Extract validation error messages
        const messages = Object.values(err.errors).map(val => val.message);
        // throw new expressError(401,messages);
    }
    res.status(err.status || 400).render('error.ejs',{err});
    console.log(err.message);
    // res.status(err.status || 500).send(err.message || "something went wrong!");
});

// start server
app.listen(port,()=>{
    console.log(`app is listening to port ${port}`)
});