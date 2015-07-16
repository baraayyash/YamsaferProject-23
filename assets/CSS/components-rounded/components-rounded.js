'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('components-rounded', {
        url: '/components-rounded',
        templateUrl: '../assets/CSS/components-rounded/components-rounded.html',
        controller: 'ComponentsRoundedCtrl'
      });
  });