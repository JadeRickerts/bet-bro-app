var Bet = require("../models/bet");
var Comment = require("../models/comment");

//ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkBetOwnership = function(req, res, next) {
	//is user logged in at all
	if(req.isAuthenticated()) {
		Bet.findById(req.params.id, function(err, foundBet) {
			if(err){
				res.redirect("back");
			} else {
				//does user own this bet
				if(foundBet.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	//is user logged in at all
	if(req.isAuthenticated()) {
	  Comment.findById(req.params.comment_id, function(err, foundComment) {
	    if(err){
	      res.redirect("back");
	    } else {
	      //does user own this comment
	      if(foundComment.author.id.equals(req.user._id)) {
	        next();
	      } else {
	        res.redirect("back");
	      }
	    }
	  });
	} else {
	  res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
	  return next();
	}
	res.redirect("/login");
};

module.exports = middlewareObj;