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
          //Connect new comment to campground
          foundBet.comments.push(createdComment);
          foundBet.save();
          //Redirect to bet show page
          res.redirect("/bets/" + foundBet._id);
        }
      })
    }
  })
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;