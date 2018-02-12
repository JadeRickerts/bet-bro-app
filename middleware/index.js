var Bet = require("../models/bet");
var Comment = require("../models/comment");
var GroupMatchBetProposal = require("../models/group-match-bet-proposal");

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

middlewareObj.checkBetProposalOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
			if (err) {
				req.flash("error", "Bet Proposal Not Found");
				res.redirect("back");
			} else {
				if (foundBetProposal.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	} else {
		req.flash("error", "You Need To Be Logged In To Do That");
		res.redirect("back");
	}
}

middlewareObj.checkBetProposalBetPickOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		GroupMatchBetProposal.findById(req.params.GroupMatchBetProposalId, function(err, foundBetProposal){
			if (err) {
				req.flash("error", "Bet Proposal Not Found");
				res.redirect("back");
			} else {
				foundBetProposal.acceptedBetPicks[req.body.count-1].author.id.equals(req.user._id);
				if (foundBetProposal.acceptedBetPicks[req.body.count-1].author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		})
	} else {
		req.flash("error", "You Need To Be Logged In To Do That");
		res.redirect("back");
	}
}

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

middlewareObj.isAdministrator = function(req, res, next) {
	if(req.isAuthenticated() && req.user.role === "administrator"){
	  return next();
	}
	req.flash("error", "You need to be logged in as administrator to do that.");
	res.redirect("/login");
};

module.exports = middlewareObj;