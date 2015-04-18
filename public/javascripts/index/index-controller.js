angular.module('SolarProject')
.controller('LogsController', [ '$scope', 'socket', function($scope, socket){
	$scope.data = {};
    var obj;
	socket.on('data', function(data) {

	if (Object.keys(data) !== undefined || Object.keys(data).length !== 0) {
		obj = data.map(function(obj) {
			return [+new Date(obj.created_at), obj.power];
		});
	}
	   
	 $scope.options = {
        chart: {
            type: 'stackedAreaChart',
            height: 400,
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
//            yDomain: [0,15000],
                xAxis: {
                showMaxMin: false,
                tickFormat: function(d) {
                    // return ''
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

}]); 