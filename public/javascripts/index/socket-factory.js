angular.module('SolarProject')
.factory('socket', function SocketFactory() {
	var socket = io.connect('http://solar-test.herokuapp.com/');
	return socket;
});