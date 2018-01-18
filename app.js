//REQUIRED MODULES
var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose");


//SETTINGS
// app.set("view eninge", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//SERVER CONFIG
app.listen(3000, function(){
  console.log("Server started on PORT 3000")
});

//DATABASE CONFIG
mongoose.connect('mongodb://localhost/bet_bro');

//DATABASE SCHEMA SETUP
var betSchema = new mongoose.Schema({
  description: String,
  imageURL: String,
  date: String,
  betType: String
});

//BET MODEL
var Bet = mongoose.model("Bet", betSchema);

//SEED DATABASE
Bet.create({
  description: "England vs France",
  imageURL: "http://via.placeholder.com/300.png/09f/fff",
  date: "23-07-2018",
  betType: "matchBet"
}, function(err, bet){
  if(err){
    console.log(err);
  }
  else {
    console.log("NEWLY CREATED BET");
    console.log(bet);
  }
});

//ROUTES
//Landing Page
app.get("/", function(req, res){
    res.render("landing.ejs");
});

//INDEX ROUTE
//View Bets Page
app.get("/bets", function(req, res){
  //Connect to mongoose db data
  //Get all bets from DB
  Bet.find({}, function(err, allBets){
    if(err){
      console.log(err);
    }
    else {
      res.render("bets.ejs", {bets: allBets});
    }
  });
});

//CREATE ROUTE
//Create Bets Page
app.post("/bets", function(req, res){
   //get data from form and add to the bets array
   var description = req.body.description;
   var date = req.body.date;
   var image = "https://upload.wikimedia.org/wikipedia/commons/8/88/Simple_Soccer_Ball.svg";
   //Create a new object with the variables taken from the form.
   var newBet = {description: description, imageURL: image, date: date};
   //Create new bet and save to DB
   Bet.create(newBet, function(err, newlyCreated){
    if(err){
      console.log(err);
    }
    else {
      //redirect back to bets page
      res.redirect("/bets");
    }
   });
});

//NEW ROUTE
//New Bet Page
app.get("/bets/new", function(req, res) {
   res.render("new.ejs");
});

//SHOW ROUTE
app.get("/bets/:id", function(req, res){
  //Find the bet with the provided ID
  //Render Show page template with the campground
  res.send("This will be the show page one day!");
});