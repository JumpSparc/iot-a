angular.module('SolarProject')
.factory('socket', function SocketFactory() {
	var socket = io.connect('/');
	return socket;
});