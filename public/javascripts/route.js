angular.module('SolarProject')
.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: '/templates/logs.html'
	})
	.otherwise({redirectTo: '/'});
});