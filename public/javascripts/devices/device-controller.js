angular.module('SolarProject')
.controller('DeviceController',['$http', '$scope','ngDialog', function($http, $scope, ngDialog) {
	
	$scope.step = 0;
  $scope.form = {};
  $scope.edit = {};
	$scope.destroy = {};

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
  	if (isValid) {
	  	$http.post("/add_device", this.form)
	  	.success(function(data) {
        $scope.devices.unshift(data);
	  	})
	  	.error(function(data){
		    console.log('err' + data);
	  	});
	  	
	  	// reset form
	  	$scope.cancel();
  	}
  };

  $scope.editDevice = function(device){
    $scope.edit = device;
    ngDialog.open({
      template: '../templates/edit-device.html',
      className: 'ngdialog-theme-flat',
      scope: $scope
    });
  };

  $scope.updateDevice = function(isValid){
    if (isValid) {
      $http.put('/device/' + this.edit._id, this.edit )
      .success(function(data){
      })
      .error(function(data){
        console.log('err: ' + data);
      });
      this.closeThisDialog();
    }
  };
      
  $scope.destroyConfirm = function(device, index){
    $scope.destroy = device;
    $scope.destroy.index = index;
    ngDialog.openConfirm({
      scope: $scope,
      template: '../templates/destroy-confirm.html'
    })
    .then(function(device){
      $http.delete('/device/' + $scope.destroy._id)
      .success(function(data){
        $scope.devices.splice(device.index, 1);
        $scope.destroy = {};
      });

    },function(reject){
        console.log(reject);
    });
  };
        
        

  // $scope.destroyDevice = function($event, device, index){
  //   $http.delete('/device/' + device._id)
  //   .success(function(data){
  //     $scope.devices.splice(index, 1);
  //   });
  // };
  		
  $scope.cancel = function(){
	  $scope.form = {};
  	$scope.step = 0;
  }


  $scope.types = ['electricity', 'temperature'];
  $scope.graphs = ['line','bar']
  // $scope.graphs = [
  //   {value: "stackedAreaChart", name: "Line"},
  //   {value: "multiBarChart", name: "Bar"}
  // ];
}]);