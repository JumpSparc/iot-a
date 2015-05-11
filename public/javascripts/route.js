angular.module('SolarProject')
.config(function($routeProvider){
	$routeProvider.when('/devices/', {
		templateUrl: '/templates/devices.html',
		controller: 'DeviceController'
	})
	.when('/device/edit/:id', {
		templateUrl: '/templates/edit-device.html',
		controller: 'DeviceController'
	})
	.when('/device/view/:id', {
		templateUrl: '/templates/edit-device.html',
		controller: 'DeviceController'
	})
	.otherwise({redirectTo: '/'});
});