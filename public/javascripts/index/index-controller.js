angular.module('SolarProject')
.controller('LogsController', ['$http', '$scope', 'socket', function($http, $scope, socket){
  // $scope.data = [
  // {
  //     "key" : "Power" ,
  //     "values" : []
  // }];
  $scope.devices = [];
  
  $scope.nav = 0;
  $scope.currentNav = function(index){
    $scope.nav = index;
  };

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
  $scope.lineOptions = {
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
          rotateLabels: 10,
          tickFormat: function(d) {            
              return d3.time.format('%b %e %H:%M:%S')(new Date(d))
          }
        },
        yAxis: {
          tickFormat: function(d){
              return d3.format(',.2f')(d);
          }
        }
      }
    };

    $scope.barOptions = {
      chart: {
        type: 'historicalBarChart',
        height: 400,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 80
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        showValues: true,
        valueFormat: function(d){
            return d3.format(',.1f')(d);
        },
        transitionDuration: 500,
        xAxis: {
            tickFormat: function(d) {
                return d3.time.format('%b %e %H:%M:%S')(new Date(d))
            },
            rotateLabels: 10,
            showMaxMin: false
        },
        yAxis: {
            tickFormat: function(d){
                return d3.format(',.1f')(d);
            }
        }
      }
    };

    // listen for push data
    socket.on('data', function(data) {
        
      if (data.power !== undefined || data.created_at !== undefined) {
        for (var i = 0; i < $scope.devices.length; i++) {
          if ($scope.devices[i][0]._id == data.device_id) {
            $scope.devices[i][0].values.push([+new Date(data.created_at), data.power]);
            break;
          }
        };
        $scope.$apply();    
            
      // if (data.power !== undefined || data.created_at !== undefined) {
      //   $scope.devices[0][0].values.push([+new Date(data.created_at), data.power]);
      // }
      // $scope.$apply();    

      }

    });

}]); 