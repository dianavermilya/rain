'use strict';

angular.module('mean.system').controller('RainController', ['$scope', '$rootScope', 'Global', 'RainService',
  function($scope, $rootScope, Global, rainService) {
    $scope.results = null;
    rainService.query({}, function(results) {
      var grid = 'grid';
      $scope.grid = results[0][grid];

 



      $scope.results = results;
      console.log('results', results[0].oldGrid);
    });
  }
]);
