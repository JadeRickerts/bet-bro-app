var mongoose = require("mongoose");

var groupMatchBetProposalSchema = mongoose.Schema({
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	amount: Number,
	numberOfBetters: Number,
	betPicks: [
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
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("GroupMatchBetProposal", groupMatchBetProposalSchema);