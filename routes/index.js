module.exports = function(router, io) {
	var Log = require('../models/log.js');


	var fs  = require('fs');
	var obj = {};

	io.on('connection', function(client){
	  console.log('Client connected!');
	 //  Log.find({}, function(err, logs) {
		//   if (err) throw err;
		//   obj = logs;
		// });

	  // get data from file
   	 fs.readFile('./public/logs.json', 'utf8', function(err, data){
	    obj = JSON.parse(data);
	  });

    // emit to new connection
	  client.emit('data',obj);

	  // listen to connection
	  client.on('data', function(data){
	  	// push data to object
	  	obj.push(data);

	  	// update file
	  	updateFile(obj);

	  	// broadcast to others
	  	client.broadcast.emit('data',obj);

	  	// emit to self
	  	client.emit('data',obj);
	  });
	});

	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index');
	})
	.get('/push', function(req, r2es, next) {
		console.log('push data:' +  (JSON.stringify(req.query))); 
		
		// var newLog = Log({
		// 	id: 			req.query.guid,
		// 	power: 		req.query.power,
		// 	energy: 	req.query.energy,
		// 	duration: req.query.duration,
		// 	tstamp: 	req.query.tstamp
		// });
		
		// newLog.save(function(err) {
		// 	if(err) throw err;
		// 	var out = {};
		// 	Log.find({}, function(err, logs) {
		// 	  if (err) throw err;
		// 	  out = logs;
		// 	  console.log('all:' + out);
		// 		io.sockets.emit('data',out);
		// 	});
		// 	res.json('save success!');
		// });
		
		obj.push(req.query);
		// update
		updateFile(obj);
		io.sockets.emit('data', obj);
		res.json("Success");
	})
	// return integer value of current date
	.get('/get_time', function(req, res, next) {
		var currentdate = +new Date(); 
		res.json(currentdate);
	}); 

	function updateFile(data){
		fs.writeFile('./public/logs.json',JSON.stringify(data) , function(err) {
			if(err){
				console.log(err);
			}else{
				console.log('Update success!');
			}
		});
	}

};