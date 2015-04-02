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
	})
	.get('/push', function(req, res, next) {

		console.log('push data!'); 
		// console.log(req.query); 
		obj.push(req.query);
		
		// update
		updateFile(obj);
		io.sockets.emit('data', obj);
		res.json("Success");
	})
	.get('/get_time', function(req, res, next) {
		var currentdate = new Date(); 
		var monnth = ((currentdate.getMonth()+1 ) < 10 ) ? '0' + (currentdate.getMonth()+1 ) :  (currentdate.getMonth()+1 );
		var datetime = currentdate.getFullYear() + "-"  
                + monnth  + "-"  
								+ currentdate.getDate() + " "
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
		res.json(datetime);
	})

	; 

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