angular.module('SolarProject')
.config(function($routeProvider){
	$routeProvider.when('/push', {
		templateUrl: '/templates/push.html'
	})
	.when('/', {
		templateUrl: '/templates/logs.html'
	})
	.otherwise({redirectTo: '/'});
});