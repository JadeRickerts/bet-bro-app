//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var GroupMatchBet = require("../models/group-match-bet");
var GroupMatchBetProposal = require("../models/group-match-bet-proposal");
var middleware = require("../middleware");

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
  //Lookup bet using ID
  GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
    if(err){
      console.log(err);
      req.flash("error", "Bet Proposal Not Found");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    }
    else{
      var author = {
        id: req.user._id,
        username: req.user.username
      },
      betPick = req.body.betPick,
      acceptedBetPick = {
        author: author,
        betPick: betPick
      }
      foundBetProposal.acceptedBetPicks.push(acceptedBetPick);
      foundBetProposal.save();
      req.flash("success", "Bet Proposal Accepted");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    }
  })
});

//UPDATE ROUTE
router.put("/:betPickId", middleware.checkBetProposalBetPickOwnership, function(req, res){
  //Lookup bet using ID
  GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
    if(err){
      console.log(err);
      req.flash("error", "Bet Proposal Not Found");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    } else {
      foundBetProposal.acceptedBetPicks[req.body.count-1].betPick = req.body.betPickEdit;
      foundBetProposal.save(function(err){
        if (err) {
          console.log(err);
          req.flash("error", "Could Not Edit Bet Proposal Bet Pick");
          req.redirect("back");
        }
      req.flash("success", "Bet Proposal Bet Pick Successfully Edited");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
      });
    }
  });
});


//DESTROY ROUTE
router.delete("/:betPickId", middleware.checkBetProposalBetPickOwnership, function(req, res){
  //Lookup bet using ID
  GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
    if(err){
      console.log(err);
      req.flash("error", "Bet Proposal Not Found");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    } else {
      foundBetProposal.acceptedBetPicks[req.body.count-1].remove();
      foundBetProposal.save(function(err){
        if (err) {
          console.log(err);
          req.flash("error", "Could Not Edit Bet Proposal Bet Pick");
          req.redirect("back");
        }
      req.flash("success", "Bet Proposal Bet Pick Successfully Deleted");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
      });
    }
  });
});

module.exports = router;