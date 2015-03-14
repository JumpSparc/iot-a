module.exports = function(router, io) {
	
	var fs = require('fs');
	var obj= [];

	io.on('connection', function(client){
	  console.log('Client connected!');
	  
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
	});


	router.post('/push', function(req, res, next) {
		console.log('push data!'); 
		obj.push(req.body);
		
		// update
		updateFile(obj);
		io.sockets.emit('data', obj);
		res.json("Success");
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