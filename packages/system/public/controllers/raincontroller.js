'use strict';

angular.module('mean.system').controller('RainController', ['$scope', '$rootScope', 'Global', 'RainService',
  function($scope, $rootScope, Global, rainService) {
    $scope.results = null;
    rainService.query({}, function(results) {
      var grid = 'grid';
      var water = 'water';

      $scope.grid = results[0][grid];
      $scope.water = results[0][water];


      $scope.results = results;
    });
  }
]);
