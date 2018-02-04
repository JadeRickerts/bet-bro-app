var mongoose = require("mongoose");

var groupMatchBetSchema = new mongoose.Schema({
	homeTeamName: String,
	awayTeamName: String,
	imageURL: String,
	stadium: String,
	betStatus: String,
	betCreatedDate: { 
		type: Date
	},
	betModifiedDate: { 
		type: Date
	},
	kickOffDate: { 
		type: Date 
	}
});

module.exports = mongoose.model("GroupMatchBet", groupMatchBetSchema);