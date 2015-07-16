'use strict';

angular.module('internsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('customers', {
        url: '/customers',
        templateUrl: 'app/customers/customers.html',
        controller: 'CustomersCtrl'
      });

    // $stateProvider
    // .state('customers.customer', {
    //   url: '/customers',
    //   templateUrl: 'app/customers/customers.html/:id',
    //   controller: 'CustomersCtrl'
    // });
  });