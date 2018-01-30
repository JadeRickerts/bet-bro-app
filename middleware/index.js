var Bet = require("../models/bet");
var Comment = require("../models/comment");

//ALL THE MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkBetOwnership = function(req, res, next) {
	//is user logged in at all
	if(req.isAuthenticated()) {
		Bet.findById(req.params.id, function(err, foundBet) {
			if(err){
				req.flash("error", "Bet not found");
				res.redirect("back");
			} else {
				//does user own this bet
				if(foundBet.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	//is user logged in at all
	if(req.isAuthenticated()) {
	  Comment.findById(req.params.comment_id, function(err, foundComment) {
	    if(err){
		    req.flash("error", "Comment not found");
		    res.redirect("back");
	    } else {
			//does user own this comment
			if(foundComment.author.id.equals(req.user._id)) {
			next();
			} else {
			req.flash("error", "You don't have permission to do that.");
			res.redirect("back");
			}
	    }
	  });
	} else {
		req.flash("error", "You need to be logged in to do that.");
	    res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
	  return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
};

module.exports = middlewareObj;