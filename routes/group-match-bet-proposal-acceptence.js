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
      foundBetProposal.betPicks.push(acceptedBetPick);
      foundBetProposal.save();
      req.flash("success", "Bet Proposal Accepted");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    }
  })
});

//UPDATE ROUTE
router.put("/:betPickId", function(req, res){
  //Lookup bet using ID
  GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
    if(err){
      console.log(err);
      req.flash("error", "Bet Proposal Not Found");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    } else {
        GroupMatchBetProposal.update({'betPicks.author.username': req.user.username}, {'$set': {
          'betPicks.$.betPick': req.body.betPickEdit
        }}, function(err){
        if (err) {
          console.log(err);
          req.flash("error", "Couldn't Update Bet Pick");
          res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
            + req.params.GroupMatchBetProposalId);
        } else {
          req.flash("success", "Bet Proposal Bet Pick Successfully Edited");
          res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
            + req.params.GroupMatchBetProposalId);
          }
      });
    }
  });
});

//DESTROY ROUTE
router.delete("/:betPickId", function(req, res){
  GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
    if (err) {
      console.log(err);
      req.flash("error", "Couldn't Find Bet Proposal");
      res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
    } else {
      foundBetProposal.betPicks[req.body.count-1].remove();
      foundBetProposal.save(function (err){
        if(err){
          console.log(err);
          req.flash("error", "Couldn't Find Bet Proposal");
          res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
        } else {
          req.flash("success", "Bet Pick Successfully Deleted");
          res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" 
        + req.params.GroupMatchBetProposalId);
        }
      }); 
    }
  });
});

module.exports = router;