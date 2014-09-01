'use strict';

angular.module('mean.system').factory('RainService', ['$resource',
  function($resource) {
    return $resource('api/rain', {
    });
  }
]);