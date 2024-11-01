const User = require('../models/user');

// SIGNUP FORM
module.exports.signupForm = (req, res, next) => {
    try {
      res.render("users/signup.ejs");
    } catch (err) {
      next(err);
    }
};

// SIGNUP
module.exports.signup = async (req, res, next) => {
    let { username, email, password } = req.body.user;
    let newUser = { username, email };
    await User.register(newUser, password, (err, user) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
        return;
      } else {
        req.login(user,(err) => {
          if(err){
            return next(err);
          }
          req.flash('success',"welcome to wanderlust!");
          res.redirect('/listings');
          return;
        })
      }
    });
};

// LOGIN FORM
module.exports.loginForm = (req, res, err) => {
    if(req.isAuthenticated()){
      req.flash('success',"already logged in!");
      return res.redirect('/listings');
    }
      res.render("users/login.ejs");
};

// LOGIN
module.exports.login = async (req,res,next) => {
    req.flash('success','welcome back!');
    res.redirect(res.locals.redirectUrl || "/listings");
};

// LOGOUT
module.exports.logout = (req,res,next) => {
    if(!req.isAuthenticated()){
      req.flash('error',"You're already logged out!");
      res.redirect('/listings');
      return;
    } else{
      req.logOut((err) => {
        if(err){
          return next(err);
        }
        req.flash('success',"logged out!");
        res.redirect('/listings');
        return;
      });
    }
};