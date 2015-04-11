angular.module('SolarProject')
.controller('LogsController', [ '$scope', 'socket', function($scope, socket){
	$scope.data = {};

	socket.on('data', function(data) {
			
		if (data) {
			var obj = data.map(function(obj) {
				return [obj.tstamp, obj.power];
				// return [+new Date(obj.created_at), obj.power];
			});
		}
	   
	 $scope.options = {
        chart: {
            type: 'stackedAreaChart',
            height: 400,
            width: 1200,
            showControls: false,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 80
            },
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            useVoronoi: false,
            clipEdge: false,
            duration: 0,
            useInteractiveGuideline: true,
            xAxis: {
                showMaxMin: false,
                tickFormat: function(d) {
                    return ''
                    // return d3.time.format('%x')(new Date(d))
                }
            },
            yAxis: {
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            }
        }
    };

    $scope.data = [
        {
            "key" : "Power" ,
            "values" : obj.slice(Math.max(obj.length - 500, 1))
        }

    ];
		$scope.$apply();
	});

  // function generateLabel(filter){
		// var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		// var currentdate = new Date(); 
		// var month = ((currentdate.getMonth()+1 ) < 10 ) ? '0' + (currentdate.getMonth()+1 ) :  (currentdate.getMonth()+1 );
		// var date = (currentdate.getDate()  < 10 ) ? '0' + currentdate.getDate() :  currentdate.getDate();

  // 	switch(filter){

  // 		case 'day':

  // 			return [];
  // 		break;

  // 		case 'month':

  // 			return [];
  // 		break;
  // 	}
  // };
  // 
}]); 