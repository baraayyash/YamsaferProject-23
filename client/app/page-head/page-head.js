'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page-head', {
        url: '/page-head',
        templateUrl: 'app/page-head/page-head.html',
        controller: 'PageHeadCtrl'
      });
  });