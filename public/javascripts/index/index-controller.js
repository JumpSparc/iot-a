angular.module('SolarProject')
.controller('LogsController', [ '$scope', 'socket', function($scope, socket){
	$scope.data = {};
	socket.on('data', function(data) {
		$scope.data = data;
		$scope.$apply();
	});
}]); 