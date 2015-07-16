'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('content', {
        url: '/content',
        templateUrl: 'app/content/content.html',
        controller: 'ContentCtrl'
      });
  });