//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var GroupMatchBet = require("../models/group-match-bet");
var GroupMatchBetProposal = require("../models/group-match-bet-proposal");
var middleware = require("../middleware");

//NEW ROUTE
router.get("/new", function(req, res){
	//Find bet by ID
	GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
		if(err){
			req.flash("error", "Bet not found.");
			console.log(err);
		}
		else {
			//Render template page
			res.render("groupMatchBetProposals/new.ejs", {
				//Send bet object found earlier in the route
				bet: foundBet
			});
		}
	});
});

//CREATE ROUTE
router.post("/", function(req, res){
  //Lookup bet using ID
  GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong.");
      res.redirect("/group-match-bets");
    }
    else{
      //Create a new comment
      var betAmount = req.body.betAmount,
      betPick = req.body.betPick,
      numberOfBetters = req.body.numberOfBetters,
      betProposal = {
      	betPick: betPick,
      	numberOfBetters: numberOfBetters,
      	amount: betAmount
      };

      GroupMatchBetProposal.create(betProposal, function(err, createdBetProposal){
        if(err){
          req.flash("error", "Something went wrong.");
          console.log(err);
        }
        else {
          //Add username and ID to comment
          createdBetProposal.author.id = req.user._id;
          createdBetProposal.author.username = req.user.username;
          //Save Comment
          createdBetProposal.save();
          //Connect new comment to campground
          foundBet.betProposals.push(createdBetProposal._id);
          foundBet.save();
          //Redirect to bet show page
          req.flash("success", "Bet Proposal created.");
          res.redirect("/group-match-bets/" + foundBet._id);
        }
      })
    }
  })
});

//SHOW ROUTE
router.get("/:GroupMatchBetProposalId", function(req, res){
  //Find Bet Proposal by ID
  GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
    if (err) {
      console.log(err);
      req.flash("error", "Bet Not Found");
      res.redirect("back");
    } else {
      GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
        if (err) {
          console.log(err);
          req.flash("error", "Bet Proposal Not Found");
          res.redirect("back");
        } else {
          res.render("groupMatchBetProposals/show.ejs", {
            bet: foundBet,
            betProposal: foundBetProposal
          });
        }
      });
    }
  });
});

module.exports = router;