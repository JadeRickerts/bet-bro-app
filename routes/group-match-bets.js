//REQUIRED MODULES
var express = require("express");
var router = express.Router();
// var Bet = require("../models/bet");
var middleware = require("../middleware");
//============================================================================//
//INDEX ROUTE
router.get("/", function(req, res){
	res.render("groupMatchBets/index.ejs");
});

//NEW ROUTE
router.get("/new", function(req, res){
	res.render("groupMatchBets/new.ejs");
});

//CREATE ROUTE


//SHOW ROUTE


//EDIT ROUTE


//UPDATE ROUTE


//DESTORY ROUTE

module.exports = router;