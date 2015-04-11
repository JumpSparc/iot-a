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
		console.log(obj);
		// $scope.labels =['1','2','3','4','5'];
	 //  $scope.series = ['Power'];
	 //  $scope.data = [power];
	 //  $scope.options = {
	   	// animation: false
	 //  };
	 
	   
	 $scope.options = {
        chart: {
            type: 'stackedAreaChart',
            height: 800,
            width: 1200,
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
            transitionDuration: -1,
            useInteractiveGuideline: true,
            xAxis: {
                showMaxMin: true,
                tickFormat: function(d) {
                    return d3.time.format('%x')(new Date(d))
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
            "values" : obj
        }

    ];
		$scope.$apply();
	});

  // $scope.onClick = function (points, evt) {
  //   console.log(points, evt);
  // };

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