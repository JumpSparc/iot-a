module.exports = function(router, io, passport) {
	var Log = require('../models/log.js');


	/* GET home page. */
	router.get('/', isLoggedIn ,function(req, res, next) {
	var obj = {};
		io.on('connection', function(client){
		  console.log('Client connected!');
		 //  Log.find({}, function(err, logs) {
			//   if (err) throw err;
			//   obj = logs;
			// });

	    // emit to new connection
		  // client.emit('init',obj);

		  // listen to connection
		  client.on('data', function(data){
		  	// broadcast to others
		  	client.broadcast.emit('data',obj);

		  	// emit to self
		  	client.emit('data',obj);
		  });
		});
	  res.render('index',  {
      user : req.user // get the user out of session and pass to template
    });
	})

	// ============================
	// Get all for initial stuff
	// ============================
	.get('/fetch', function(req,res,next){
		var d = Log.find({}).sort({'created_at': -1}).limit(1000);
		d.exec( function(err, logs) {
		  if (err) throw err;
			res.send(logs);
		});
	})
	// ============================
	// PUSH NEW LOG DATA
	// ============================
	.get('/push', function(req, res, next) {
		console.log('push data:' +  (JSON.stringify(req.query))); 
		
		var newLog = Log({
			device_id: 			req.query.guid,
			power: 		req.query.power,
			energy: 	req.query.energy,
			duration: req.query.duration,
			tstamp: 	req.query.tstamp
		});
		
		// save to DB
		newLog.save(function(err) {
			if(err){ res.json(err);}
			else{

				// var out = {};
				// Log.find({}, function(err, logs) {
				//   if (err) throw err;
				//   out = logs;
				//   // console.log('all:' + out);
				// 	io.sockets.emit('data',out);
				// });
				io.sockets.emit('data',newLog);
				res.json('save success!');
			}
		});
		
	})

	// =========================
	// Return integer value of current date
	// =========================
	.get('/get_time', function(req, res, next) {
		var currentdate = +new Date(); 
		res.json("TIME: " + currentdate);
	}) 
	
	// =========================
	// Signup
	// =========================
	.get('/signup', function(req, res) {
      // render the page and pass in any flash data if it exists
      res.render('signup', { message: req.flash('signupMessage') });
  })
	.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }))

	// =========================
	// Login
	// =========================
	.get('/login', function(req,res,next){
		res.render('login', { message: req.flash('loginMessage') });
	})

	.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }))
	
	// =========================
	// Logout
	// =========================
	.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
  })

	// =========================
	// Device 
	// =========================
	.get('/devices', isLoggedIn, function(req, res, next){
    res.render('devices',  {
      user : req.user // get the user out of session and pass to template
    });
	})


	.get('/device/:id', function(req, res, next){
		res.json('asd');
	});


	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();

	    // if they aren't redirect them to the home page
	    res.redirect('/login');
	}
};