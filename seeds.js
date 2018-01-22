var mongoose = require("mongoose");
var Bet = require("./models/bet.js");
var Comment = require("./models/comment.js");

//Seed Data
var data = [
	{
		description: "England vs Portugal",
		imageURL: "/images/placeholder-250x250.jpg",
		date: "23/07/2018",
		betType: "matchbet"
	},
	{
		description: "Germany vs Spain",
		imageURL: "/images/placeholder-250x250.jpg",
		date: "24/07/2018",
		betType: "matchbet"
	},
	{
		description: "Cameroon vs Brazil",
		imageURL: "/images/placeholder-250x250.jpg",
		date: "25/07/2018",
		betType: "matchbet"
	}
];

//Remove all data from the database, then create the seeded data
//See above array of bet objects that will be created
function seedDB(){
	//Remove all bets
	Bet.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds");
		//add a few bets
		data.forEach(function(seed){
			Bet.create(seed, function(err, bet){
				if(err){
					console.log(err);
				}
				else{
					console.log("added a bet");
					//create a comment
					Comment.create({
						text: "Change the bet amount",
						author: "Homer Simpson"
					}, function(err, comment){
						if(err){
							console.log(err);
						}
						else{
							bet.comments.push(comment._id);
							bet.save();
							console.log("created new comment");
						}
					});
				}
			})
		});
	});
};

module.exports = seedDB;
