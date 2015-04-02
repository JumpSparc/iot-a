angular.module('SolarProject')
.controller('PushController', [ '$scope', 'socket', function($scope, socket){
	$scope.log = {};
	
	$scope.pushLog = function(log){
		// send to server
		socket.emit('data',log);
		// reset form
		$scope.log = {};
	}

}]); 