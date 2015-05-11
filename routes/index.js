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

	.get('/generate', function(req,res,next){
		res.render('generate');
	})
	// ============================
	// Get all for initial stuff
	// ============================
	.get('/fetch', function(req,res,next){
		async.map(req.user.devices, function(key, next){
			var obj = {};

			Device.findOne({"_id": key}).exec(function(err,d){
			  if (err) throw err; 
				obj["_id"] = d._id;
				obj["key"] = d.type;
				obj["name"] = d.name;
				obj["graph"] = d.graph;
				obj["gmap"] = d.gmap;
			});

			var log = Log.find({"device_id": key}).sort({'created_at': -1}).limit(1000);
			log.exec( function(err, logs) {
			  if (err) throw err; 
				if (logs.length > 0) {
					obj["values"] = logs.map(function(log) {
	          return [+new Date(log.created_at), log.power];
	        });
				}else{
					obj["values"] = []
				}

			  next(err,[obj]);
			});

		},

		function(err,result){
		  if (err) throw err;
			res.send(result.reverse());
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

	// view device
	.get('/device/:id', function(req, res, next){
		res.json('asd');
	})

	// update device
	.put('/device/:id', function(req, res, next){
		Device.update({"_id": req.params.id},{
			name: req.body.name,
			type: req.body.type,
			graph: req.body.graph,
			gmap: req.body.gmap
		}, function(err, device){
			
			res.json(device);
		});
	})


	.delete('/device/:id', function(req, res, next){
    Device.findOneAndRemove({ "_id": req.params.id}, function(err,result) {
    if (err) { res.json('fail to remove from devices'); }
    	var ObjectId = require('mongoose').Types.ObjectId;
    	var user = User.findOneAndUpdate({ "_id": req.user._id}, 
    		{ $pull: {"devices": new ObjectId(req.params.id)}}, function(f, s){
    		if (f) { res.json('fail to remove from user'); }
    		res.json('delete success ');
    	});
    });
		
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