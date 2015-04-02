angular.module('SolarProject')
.controller('LogsController', [ '$scope', 'socket', function($scope, socket){
	$scope.data = {};
	socket.on('data', function(data) {
		var power = data.map(function(obj) {
			return obj.power;
		});
		$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	  $scope.series = ['Power'];
	  $scope.data = [power];
	  $scope.options = {
	  	animation: false;
	  };
		$scope.$apply();
	});
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
}]); 