'use strict';

angular.module('internsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
    'smart-table',
    'angular-timeline',
    'daterangepicker'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
  });