//REQUIRED MODULES
var express = require("express");
var router = express.Router();
var Bet = require("../models/bet");
var middleware = require("../middleware");
//============================================================================//
//INDEX ROUTE
//View Bets Page
router.get("/", function (req, res) {
  //Connect to mongoose db data
  //Get all bets from DB
  Bet.find({}, function (err, allBets) {
    if (err) {
      req.flash("error", "Bet not found.");
      console.log(err);
    }
    else {
      res.render("bets/index.ejs", {bets: allBets, currentUser: req.user});
    }
  });
});

//CREATE ROUTE
//Create Bets Page
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to the bets array
   var description = req.body.description;
   var date = req.body.date;
   var image = "https://screenshotlayer.com/images/assets/placeholder.png";
   var betType = req.body.betType;
   var author = {
    id: req.user._id,
    username: req.user.username
   };
   //Create a new object with the variables taken from the form.
   var newBet = {
   	description: description, 
   	imageURL: image, 
   	date: date,
   	betType: betType,
    author: author
   };
   //Create new bet and save to DB
   Bet.create(newBet, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      //redirect back to bets page
      req.flash("success", "Bet created.");
      res.redirect("/bets");
    }
   });
});

//NEW ROUTE
//New Bet Page
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("bets/new.ejs");
});

//SHOW ROUTE
//Display specific bet with additional information
router.get("/:id", function(req, res){
  //Find the bet with the provided ID
  console.log("===================" + req.params.id);
  Bet.findById(req.params.id).populate("comments").exec(function(err, foundBet){
  	if(err){
  		console.log(err);
  	}
  	else {
  		console.log(foundBet);
  		//Render Show page template with the campground
  		res.render("bets/show.ejs", {
  			bet: foundBet
  		});
  	}
  });
});

//EDIT BET ROUTE
router.get("/:id/edit", middleware.checkBetOwnership, function(req, res){
  Bet.findById(req.params.id, function(err, foundBet){
    res.render("bets/edit.ejs", {bet: foundBet});
  });
});

//UPDATE BET ROUTE
router.put("/:id", middleware.checkBetOwnership, function(req, res){
  //Find and update the correct bet
  Bet.findByIdAndUpdate(req.params.id, req.body.bet, function(err, updatedBet){
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("/bets");
    } else {
      //redirect to show page
      req.flash("success", "Bet updated.");
      res.redirect("/bets/" + req.params.id);
    }
  })
});

//DESTROY BET ROUTE
router.delete("/:id", middleware.checkBetOwnership, function(req, res){
  Bet.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("/bets");
    } else {
      req.flash("success", "Bet deleted.");
      res.redirect("/bets");
    }
  })
})


module.exports = router;