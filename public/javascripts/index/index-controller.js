angular.module('SolarProject')
.controller('LogsController', ['$http', '$scope', 'socket', function($http, $scope, socket){
  $scope.data = [
  {
      "key" : "Power" ,
      "values" : []
  }];
  
  $scope.devices = [];

  // Get initial data from server
  $http.get('/fetch')
    .success(function(data, status, headers, config){
      if (Object.keys(data) !== undefined) {
        $scope.devices = data;
      }
    })
    .error(function(data, status, headers, config) {
      console.log('err' + data);
    });





  // Chart options
  $scope.options = {
    chart: {
        type: 'stackedAreaChart',
        height: 400,
        showControls: false,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 80
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        useVoronoi: false,
        clipEdge: false,
        duration: 0,
        useInteractiveGuideline: true,
    //  yDomain: [0,15000],
    xAxis: {
    showMaxMin: false,
    tickFormat: function(d) {
              // return ''
            return d3.time.format('%x')(new Date(d))
          }
        },
        yAxis: {
          tickFormat: function(d){
              return d3.format(',.2f')(d);
          }
        }
      }
    };

    // listen for push data
    socket.on('data', function(data) {
        
      if (data.power !== undefined || data.created_at !== undefined) {
        $scope.data[0].values.push([+new Date(data.created_at), data.power]);
      }
      $scope.$apply();    

    });

}]); 