var router  = require('express').Router();
module.exports = function(passport) {
	"use strict";

	/* GET home page. */
	router.get('/' ,function(req, res, next) {
	  res.render('index');
	});

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/login');
	}

	return router;
};