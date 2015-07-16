'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('singleCustomer', {
        url: '/singleCustomer/:id',
        templateUrl: 'app/singleCustomer/singleCustomer.html',
        controller: 'SingleCustomerCtrl'
      });
  });