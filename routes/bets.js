//REQUIRED MODULES
var express = require("express");
var router = express.Router();
var Bet = require("../models/bet");

//INDEX ROUTE
//View Bets Page
router.get("/", function (req, res) {
  //Connect to mongoose db data
  //Get all bets from DB
  Bet.find({}, function (err, allBets) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("bets/index.ejs", {bets: allBets, currentUser: req.user});
    }
  });
});

//CREATE ROUTE
//Create Bets Page
router.post("/", function(req, res){
   //get data from form and add to the bets array
   var description = req.body.description;
   var date = req.body.date;
   var image = "http://via.placeholder.com/300.png/09f/fff";
   var betType = req.body.betType;
   //Create a new object with the variables taken from the form.
   var newBet = {
   	description: description, 
   	imageURL: image, 
   	date: date,
   	betType: betType
   };
   //Create new bet and save to DB
   Bet.create(newBet, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      //redirect back to bets page
      res.redirect("/bets");
    }
   });
});

//NEW ROUTE
//New Bet Page
router.get("/new", function(req, res) {
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

module.exports = router;