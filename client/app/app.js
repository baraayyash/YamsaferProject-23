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
        'daterangepicker',
        'leaflet-directive',
        'infinite-scroll'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        
        $urlRouterProvider
            .otherwise('/timeline');

        // $locationProvider.html5Mode(true);
    });
