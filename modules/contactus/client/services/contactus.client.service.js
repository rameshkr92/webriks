'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('contactus').factory('Contactus', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
