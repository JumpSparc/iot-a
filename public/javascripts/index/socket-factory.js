angular.module('SolarProject')
.factory('socket', function SocketFactory() {
	var socket = io.connect(window.location.href);
	return socket;
});