//DATABASE SCHEMA SETUP
var mongoose = require("mongoose");

var betSchema = new mongoose.Schema({
  description: String,
  imageURL: String,
  date: String,
  betType: String
});

//BET MODEL
module.exports = mongoose.model("Bet", betSchema);