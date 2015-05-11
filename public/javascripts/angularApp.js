(function() {
	angular.module('SolarProject', ["ngResource","ngRoute","nvd3", "ngDialog"]); 


	// capitalize filter
	angular.module('SolarProject')
	.filter('capitalize', function() {
	  return function(input, scope) {
	  	if (input === undefined ) { return null;}
	    if (input!=null)
	    input = input.toLowerCase();
	    return input.substring(0,1).toUpperCase()+input.substring(1);
	  }
	});
})();

