//DATABASE SCHEMA SETUP
var mongoose = require("mongoose");

var betSchema = new mongoose.Schema({
  description: String,
  imageURL: String,
  date: String,
  betType: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
  	{
  		type: mongoose.Schema.Types.ObjectId,
  		ref: "Comment"
  	}
  ],
});

//BET MODEL
module.exports = mongoose.model("Bet", betSchema);