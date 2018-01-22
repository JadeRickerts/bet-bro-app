//REQUIRED MODULES
var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
Bet 		    = require("./models/bet.js"),
Comment     = require("./models/comment.js")
path 		    = require('path'),
seedDB		  = require("./seeds.js");

//DATABASE CONFIG
mongoose.connect('mongodb://localhost/bet_bro');

//SETTINGS
app.use(bodyParser.urlencoded({extended: true}));
// app.set("view eninge", "ejs");

//Seed theDatabase
seedDB();

//Serve public folder - path setup
app.use(express.static(path.join(__dirname, 'public')));

//SERVER CONFIG
app.listen(3000, function(){
  console.log("Server started on PORT 3000")
});

//=========================================================
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
      res.render("bets/index.ejs", {bets: allBets});
    }
  });
});

//CREATE ROUTE
//Create Bets Page
app.post("/bets", function(req, res){
   //get data from form and add to the bets array
   var description = req.body.description;
   var date = req.body.date;
   var image = "http://via.placeholder.com/300.png/09f/fff";
   var betType = req.body.betType;
   //Create a new object with the variables taken from the form.
   var newBet = {
   	description: description, 
   	imageURL: image, 
   	date: date,
   	betType: betType
   };
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
   res.render("bets/new.ejs");
});

//SHOW ROUTE
app.get("/bets/:id", function(req, res){
  //Find the bet with the provided ID
  Bet.findById(req.params.id).populate("comments").exec(function(err, foundBet){
  	if(err){
  		console.log(err);
  	}
  	else {
  		console.log(foundBet);
  		//Render Show page template with the campground
  		res.render("bets/show.ejs", {
  			bet: foundBet
  		});
  	}
  });
});

//=================================================
//Comments Routes
app.get("/bets/:id/comments/new", function(req, res){
	//Find bet by ID
  Bet.findById(req.params.id, function(err, foundBet){
    if(err){
      console.log(err);
    }
    else{
      //Render template page
      res.render("comments/new.ejs", {
        //Send bet object found earlier in the route
        bet: foundBet
      });
    }
  });
});

app.post("/bets/:id/comments", function(req, res){
  //Lookup bet using ID
  Bet.findById(req.params.id, function(err, foundBet){
    if(err){
      console.log(err);
      res.redirect("/bets");
    }
    else{
      //Create a new comment
      Comment.create(req.body.comment, function(err, createdComment){
        if(err){
          console.log(err);
        }
        else {
          //Connect new comment to campground
          foundBet.comments.push(createdComment);
          foundBet.save();
          //Redirect to bet show page
          res.redirect("/bets/" + foundBet._id);
        }
      })
    }
  })
});