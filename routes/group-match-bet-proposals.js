//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var GroupMatchBet = require("../models/group-match-bet");
var GroupMatchBetProposal = require("../models/group-match-bet-proposal");
var middleware = require("../middleware");

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
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
          res.redirect("/group-match-bets/" + foundBet._id + "/group-match-bet-proposals/" + createdBetProposal._id);
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
      GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId).populate("comments").exec(function(err, foundBetProposal){
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

//EDIT ROUTE
router.get("/:GroupMatchBetProposalId/edit", middleware.checkBetProposalOwnership, function(req, res){
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
          res.render("GroupMatchBetProposals/edit.ejs", {
            bet: foundBet,
            betProposal: foundBetProposal
          });
        }
      });
    }
  });
});


//UPDATE ROUTE
router.put("/:GroupMatchBetProposalId", middleware.checkBetProposalOwnership, function(req, res){
  //Create a new comment
  var betAmount = req.body.betAmount,
  betPick = req.body.betPick,
  numberOfBetters = req.body.numberOfBetters,
  betProposal = {
    betPick: betPick,
    numberOfBetters: numberOfBetters,
    amount: betAmount
  };
  GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
    if (err) {
      console.log(err);
      req.flash("error", "Bet Not Found");
      res.redirect("back");
    } else {
      GroupMatchBetProposal.findByIdAndUpdate(req.params.GroupMatchBetProposalId, betProposal, function(err, foundBetProposal){
        if (err) {
          console.log(err);
          req.flash("error", "Bet Proposal Not Found");
          res.redirect("back");
        } else {
          req.flash("success", "Bet Proposal Updated");
          res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" + req.params.GroupMatchBetProposalId);
        }
      })
    }
  })
});

//DESTROY ROUTE
router.delete("/:GroupMatchBetProposalId", middleware.checkBetProposalOwnership, function(req, res){
  GroupMatchBetProposal.findByIdAndRemove(req.params.GroupMatchBetProposalId, function(err){
    if(err) {
      console.log(err);
      req.flash("error", "Could Not Delete Bet Proposal");
      res.redirect("back");
    } else {
      req.flash("success", "Deleted Bet Proposal");
      res.redirect("/group-match-bets");
    }
  })
})

module.exports = router;