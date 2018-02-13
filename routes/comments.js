//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var GroupMatchBet = require("../models/group-match-bet");
var GroupMatchBetProposal = require("../models/group-match-bet-proposal");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
  //Find bet by ID
  GroupMatchBet.findById(req.params.GroupMatchBetId, function(err, foundBet){
    if(err){
      console.log(err);
      req.flash("error", "Bet Not Found");
      res.redirect("back");
    } else {
      //Find bet proposal by ID
      GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
        if(err){
          req.flash("error", "Bet Proposal Not Found.");
          console.log(err);
        }
        else{
          //Render template page
          res.render("comments/new.ejs", {
            //Send bet object found earlier in the route
            bet: foundBet,
            betProposal: foundBetProposal
          });
        }
      });
    }
  });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
  //Lookup bet using ID
  GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
    if(err){
      console.log(err);
      req.flash("error", "Bet Proposal Not Found.");
      res.redirect("back");
    }
    else{
      //Create a new comment
      Comment.create(req.body.comment, function(err, createdComment){
        if(err){
          req.flash("error", "Could Not Create Comment.");
          console.log(err);
        }
        else {
          //Add username and ID to comment
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          //Save Comment
          createdComment.save();
          //Connect new comment to campground
          foundBetProposal.comments.push(createdComment._id);
          foundBetProposal.save();
          //Redirect to bet proposal show page
          req.flash("success", "Comment created.");
          res.redirect("/group-match-bets/" + req.params.GroupMatchBetId + "/group-match-bet-proposals/" + req.params.GroupMatchBetProposalId);
        }
      })
    }
  })
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      res.render("comments/edit.ejs", {bet_id: req.params.id, comment: foundComment});
    }
  });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Comment updated.");
      res.redirect("/bets/" + req.params.id);
    }
  });
});

//DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect("/bets/" + req.params.id);
    }
  });
});

module.exports = router;