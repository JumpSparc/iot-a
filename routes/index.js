module.exports = function(router, io, passport) {
	var async = require('async');
	var Log = require('../models/log.js');
	var User = require('../models/user.js');
	var Device = require('../models/device.js');

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
		var devices = [];

		async.map(req.user.devices, function(key, next){
			var d = Log.find({"device_id": key}).sort({'created_at': -1}).limit(1000);
			d.exec( function(err, logs) {
			  if (err) throw err; 
				var obj = {};
				obj["_id"] = logs[0]._id;
				obj["key"] = "Power";
				obj["values"] = logs.map(function(log) {
          return [+new Date(log.created_at), log.power];
        });

			  next(err,[obj]);
			});

		},

		function(err,result){
		  if (err) throw err;
				console.log(result);
			res.send(result);
		});

		// var d = Log.find({'device_id' : { $in: req.user.devices }}).sort({'created_at': -1}).limit(1000);


		// var d = Log.find().sort({'created_at': -1}).limit(1000);
		// d.exec( function(err, logs) {
		//   if (err) throw err;
		// 	res.send(logs);
		// });
	})
	// ============================
	// Get data for specific id
	// ============================
	.get('/fetch/:id', function(req,res,next){
		var id = req.params.id;

		var d = Log.find({'device_id' : id }).sort({'created_at': -1}).limit(1000);
		d.exec( function(err, logs) {
		  if (err) throw err;
			res.send(logs);
		});
	})
	// ============================
	// Get all for initial stuff
	// ============================
	.get('/fetch_devices', function(req,res,next){
		// User.find({ _id : //})
		// console.log(req.user.devices);
		var d = Device.find({'_id' : { $in: req.user.devices } }).sort({'created_at': -1});
		d.exec( function(err, devices) {
		  if (err) throw err;
			res.send(devices);
		});
	})
	
	// ============================
	// Add Device
	// ============================
	.post('/add_device', function(req,res,next){
		console.log(req.user);
		var newDevice = Device({
			name: req.body.name,
			type: req.body.type,
			description: req.body.description,
			graph: req.body.graph,
			gmap: req.body.gmap
		});

		newDevice.save(function(err){
			if(err){res.json(err);}

			else{
				User.findOne ({_id: req.user._id}, function(err,user){
					if(err){res.json(err);}
					user.devices.push(newDevice._id);
					user.save();
				});
				console.log('added new device');
				console.log(newDevice);
				res.json(newDevice);
			}
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