angular.module('SolarProject')
.factory('socket', function SocketFactory() {
	var socket = io.connect('http://localhost:' + process.env.PORT );
	return socket;
});