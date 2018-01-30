//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var Bet = require("../models/bet");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	//Find bet by ID
  Bet.findById(req.params.id, function(err, foundBet){
    if(err){
      req.flash("error", "Bet not found.");
      console.log(err);
    }
    else{
      //Render template page
      res.render("comments/new.ejs", {
        //Send bet object found earlier in the route
        bet: foundBet
      });
    }
  });
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
  //Lookup bet using ID
  Bet.findById(req.params.id, function(err, foundBet){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong.");
      res.redirect("/bets");
    }
    else{
      //Create a new comment
      Comment.create(req.body.comment, function(err, createdComment){
        if(err){
          req.flash("error", "Something went wrong.");
          console.log(err);
        }
        else {
          //Add username and ID to comment
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          //Save Comment
          createdComment.save();
          //Connect new comment to campground
          foundBet.comments.push(createdComment._id);
          foundBet.save();
          //Redirect to bet show page
          req.flash("success", "Comment created.");
          res.redirect("/bets/" + foundBet._id);
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