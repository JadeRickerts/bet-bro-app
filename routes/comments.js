//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var Bet = require("../models/bet");
var Comment = require("../models/comment");

//NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
	//Find bet by ID
  Bet.findById(req.params.id, function(err, foundBet){
    if(err){
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
router.post("/", isLoggedIn, function(req, res){
  //Lookup bet using ID
  Bet.findById(req.params.id, function(err, foundBet){
    if(err){
      console.log(err);
      res.redirect("/bets");
    }
    else{
      //Create a new comment
      Comment.create(req.body.comment, function(err, createdComment){
        if(err){
          console.log(err);
        }
        else {
          //Add username and ID to comment
          createdComment.author.id = req.user._id;
          createdComment.author.username = req.user.username;
          //Save Comment
          createdComment.save();
          console.log(createdComment);
          //Connect new comment to campground
          foundBet.comments.push(createdComment._id);
          foundBet.save();
          console.log("====This is the created comment: \n" + createdComment);
          //Redirect to bet show page
          res.redirect("/bets/" + foundBet._id);
        }
      })
    }
  })
});

//EDIT ROUTE
router.get("/:comment_id/edit", function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit.ejs", {bet_id: req.params.id, comment: foundComment});
    }
  });
});

//UPDATE ROUTE
router.put("/:comment_id", function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/bets/" + req.params.id);
    }
  });
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;