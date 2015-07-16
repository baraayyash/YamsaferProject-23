'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('footer', {
        url: '/footer',
        templateUrl: 'components/footer/footer.html',
        controller: 'FooterCtrl'
      });
  });