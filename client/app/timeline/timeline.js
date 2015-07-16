'use strict';

angular.module('internsApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('timeline', {
                url: '/timeline',
                templateUrl: 'app/timeline/timeline.html',
                controller: 'TimelineCtrl'
            });
    });
