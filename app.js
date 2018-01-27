//REQUIRED MODULES
var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
passport        = require("passport"),
LocalStrategy   = require("passport-local"),
methodOverride  = require("method-override"),
Bet 		        = require("./models/bet.js"),
Comment         = require("./models/comment.js"),
User            = require("./models/user"),
path 		        = require('path'),
seedDB		      = require("./seeds.js");


//REQUIRED ROUTES
var commentRoutes = require("./routes/comments"),
betRoutes         = require("./routes/bets"),
indexRoutes       = require("./routes/index");

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "This is the best social betting app!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass the currentUser object to all the templates/all routes
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//DATABASE CONFIG
mongoose.connect('mongodb://localhost/bet_bro');

//SETTINGS
app.use(bodyParser.urlencoded({extended: true}));
// app.set("view eninge", "ejs");

//Seed theDatabase
// seedDB();

//Serve public folder - path setup
app.use(express.static(path.join(__dirname, 'public')));

//METHOD OVERRIDE FOR ROUTES (PUT & DELETE)
app.use(methodOverride("_method"));

//ROUTES
app.use(indexRoutes);
app.use("/bets", betRoutes);
app.use("/bets/:id/comments", commentRoutes);

//SERVER CONFIG
app.listen(3000, function(){
  console.log("Server started on PORT 3000")
});