var mongoose = require("mongoose");

var groupMatchBetSchema = new mongoose.Schema({
	homeTeamName: String,
	awayTeamName: String,
	imageURL: String,
	stadium: String,
	betStatus: String
});

module.exports = mongoose.model("GroupMatchBet", groupMatchBetSchema);