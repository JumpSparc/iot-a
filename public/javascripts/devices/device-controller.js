angular.module('SolarProject')
.controller('DeviceController',['$http', '$scope', function($http, $scope) {
	
	$scope.step = 0;
	$scope.form = {};

	$http.get('/fetch_devices')
	.success(function(data, status, headers, config){
    if (Object.keys(data) !== undefined) {
      $scope.devices = data;
    }
  })
  .error(function(data, status, headers, config) {
    console.log('err' + data);
  });

  $scope.addDevice = function(isValid){
  	// console.log(this.form);
  	// console.log(this.newDevice);
  	// console.log(isValid);
  	if (isValid) {
	  	$http.post("/add_device", this.form)
	  	.success(function(data) {
		    console.log( data);
	  		console.log('success');
	  	})
	  	.error(function(data){
	  		console.log('error');
		    console.log('err' + data);
	  	});
	  	
	  	// reset form
	  	$scope.cancel();
  	}
  };

  $scope.checkValid = function(){
	  for(var i=0; i<arguments.length; i++) {
      // return 
	  }
  };
  		
  $scope.cancel = function(){
	  $scope.form = {};
  	$scope.step = 0;
  }

}]);