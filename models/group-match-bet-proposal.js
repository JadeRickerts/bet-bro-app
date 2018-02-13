var mongoose = require("mongoose");

var groupMatchBetProposalSchema = mongoose.Schema({
	betPick: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	amount: Number,
	numberOfBetters: Number,
	acceptedBetPicks: [
		{
			author: {
				id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User"
				},
				username: String
			},
			betPick: String,
			betPickResult: String
		}
	],
	betPickResult: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("GroupMatchBetProposal", groupMatchBetProposalSchema);