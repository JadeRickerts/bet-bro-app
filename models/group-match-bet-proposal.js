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
	numberOfBetters: Number
});

module.exports = mongoose.model("GroupMatchBetProposal", groupMatchBetProposalSchema);