'use strict';

angular.module('callLogsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('timeline', {
        url: '/timeline',
        templateUrl: 'app/timeline/timeline.html',
        controller: 'TimelineCtrl'
      });
  });