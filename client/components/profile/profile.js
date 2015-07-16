'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'components/profile/profile.html',
        controller: 'ProfileCtrl'
      });
  });