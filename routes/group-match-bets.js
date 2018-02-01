//REQUIRED MODULES
var express = require("express");
var router = express.Router();
var GroupMatchBet = require("../models/group-match-bet");
var middleware = require("../middleware");
//============================================================================//
//INDEX ROUTE
router.get("/", function(req, res){
  //Connect to mongoose db data
  //Get all bets from DB
  GroupMatchBet.find({}, function (err, allGroupMatchBets) {
    if (err) {
      req.flash("error", "Bets not found.");
      console.log(err);
    }
    else {
    	console.log(allGroupMatchBets);
    	res.render("groupMatchBets/index.ejs", {groupMatchBets: allGroupMatchBets});
    }
  });
});

//NEW ROUTE
router.get("/new", function(req, res){
	res.render("groupMatchBets/new.ejs");
});

//CREATE ROUTE
router.post("/", function(req, res){
   //get data from form and add to the bets array
   var homeTeamName = req.body.homeTeamName;
   var awayTeamName = req.body.awayTeamName;
   var imageURL = "https://screenshotlayer.com/images/assets/placeholder.png";
   var betStatus = req.body.betStatus;
   var stadium = req.body.stadium;

   //Create a new object with the variables taken from the form.
	var newBet = {
		homeTeamName: homeTeamName, 
		awayTeamName: awayTeamName, 
		imageURL: imageURL,
		betStatus: betStatus,
		stadium: stadium
	};
   //Create new bet and save to DB
   GroupMatchBet.create(newBet, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      //redirect back to bets page
      req.flash("success", "Group Match Bet Created.");
      res.redirect("/group-match-bets");
    }
   });
});

//SHOW ROUTE
router.get("/:GroupMatchBetId", function(req, res){
	GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
		if (err) {
			console.log(err);
			req.flash("error", "Bet Not Found");
			res.redirect("/group-match-bets");
		} else {
			res.render("groupMatchBets/show.ejs", {groupMatchBet: foundBet});
		}
	});
});

//EDIT ROUTE


//UPDATE ROUTE


//DESTORY ROUTE

module.exports = router;