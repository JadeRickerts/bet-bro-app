//REQUIRED MODULES
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//ROUTES
//Landing Page
router.get("/", function(req, res){
    res.render("landing.ejs");
});

//Auth Routes
//Show register form
router.get("/register", function(req, res){
  res.render("register.ejs");
});

//Handle signup logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register.ejs");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/bets");
    })
  });
});

//Show login form
router.get("/login", function(req, res){
  res.render("login.ejs");
});

//Handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/bets",
  failureRedirect: "/login"
  }), function(req, res){
});

//Logout route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/bets");
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;