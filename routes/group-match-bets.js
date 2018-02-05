//REQUIRED MODULES
var express 		     = require("express");
var router 			     = express.Router();
var GroupMatchBet 	 = require("../models/group-match-bet");
var middleware 		   = require("../middleware");
moment          	   = require("moment");
//============================================================================//
//INDEX ROUTE
router.get("/", function(req, res){
  //Connect to mongoose db data
  //Get all bets from DB
  GroupMatchBet.find({}).populate("betProposals").exec(function (err, allGroupMatchBets) {
    if (err) {
      req.flash("error", "Bets not found.");
      console.log(err);
    }
    else {
    	res.render("groupMatchBets/index.ejs", {groupMatchBets: allGroupMatchBets});
    }
  });
});

//NEW ROUTE
router.get("/new", middleware.isAdministrator, function(req, res){
	res.render("groupMatchBets/new.ejs");
});

//CREATE ROUTE
router.post("/", middleware.isAdministrator, function(req, res){
   //get data from form and add to the bets array
   var homeTeamName = req.body.homeTeamName;
   var awayTeamName = req.body.awayTeamName;
   var imageURL = "https://screenshotlayer.com/images/assets/placeholder.png";
   var betStatus = req.body.betStatus;
   var stadium = req.body.stadium;
   var kickOffDate = moment(req.body.kickOffDate, "YYYY-MM-DDTHH:mm:ssZ").toDate();
   var betModifiedDate = Date.now();
   var betCreatedDate = Date.now();

   //Create a new object with the variables taken from the form.
	var newBet = {
		homeTeamName: homeTeamName, 
		awayTeamName: awayTeamName, 
		imageURL: imageURL,
		betStatus: betStatus,
		stadium: stadium,
		kickOffDate: kickOffDate,
		betModifiedDate: betModifiedDate,
		betCreatedDate: betCreatedDate
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
router.get("/:GroupMatchBetId/edit", middleware.isAdministrator, function(req, res){
  GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
    res.render("groupMatchBets/edit.ejs", {groupMatchBet: foundBet});
  });
});

//UPDATE ROUTE
router.put("/:GroupMatchBetId", middleware.isAdministrator, function(req, res){
  //get data from form and add to the bets array
   var homeTeamName = req.body.homeTeamName;
   var awayTeamName = req.body.awayTeamName;
   var imageURL = "https://screenshotlayer.com/images/assets/placeholder.png";
   var betStatus = req.body.betStatus;
   var stadium = req.body.stadium;
   var kickOffDate = moment(req.body.kickOffDate, "YYYY-MM-DDTHH:mm:ssZ").toDate();
   var betModifiedDate = Date.now();

   //Create a new object with the variables taken from the form.
	var editedBet = {
		homeTeamName: homeTeamName, 
		awayTeamName: awayTeamName, 
		imageURL: imageURL,
		betStatus: betStatus,
		stadium: stadium,
		kickOffDate: kickOffDate,
		betModifiedDate: betModifiedDate,
	};

  //Find and update the correct bet
  GroupMatchBet.findByIdAndUpdate(req.params.GroupMatchBetId, editedBet, function(err, updatedBet){
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("/group-match-bets");
    } else {
      //redirect to show page
      req.flash("success", "Bet updated.");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId);
    }
  })
});

//DESTORY ROUTE
router.delete("/:GroupMatchBetId", middleware.isAdministrator, function(req, res){
  GroupMatchBet.findByIdAndRemove(req.params.GroupMatchBetId, function(err){
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("/group-match-bets");
    } else {
      req.flash("success", "Bet deleted.");
      res.redirect("/group-match-bets");
    }
  });
});

module.exports = router;