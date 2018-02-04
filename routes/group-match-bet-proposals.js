//REQUIRED MODULES
var express = require("express");
var router = express.Router({mergeParams: true});
var GroupMatchBet = require("../models/group-match-bet");
var GroupMatchBetProposal = require("../models/group-match-bet-proposal");
var middleware = require("../middleware");

//NEW ROUTE
router.get("/new", function(req, res){
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

module.exports = router;