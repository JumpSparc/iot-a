angular.module('SolarProject')
.factory('socket', function SocketFactory() {
	var socket = io.connect('http://localhost:3000/');
	return socket;
});