const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const expressError = require("../utils/expressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require('../utils/middlewares.js');
const userController = require('../controllers/user.js');


// Routes

router.route('/signup')
// Signup Form Route
.get(userController.signupForm)
// Signup Route
.post(asyncWrap(userController.signup));

router.route('/login')
// Login Form Route
.get(userController.loginForm)
// Login Route
.post(saveRedirectUrl , passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }), asyncWrap(userController.login));


// Logout User Route
router.get('/logout', userController.logout);

module.exports = router;
