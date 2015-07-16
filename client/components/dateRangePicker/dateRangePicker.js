'use strict';

angular.module('internsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dateRangePicker', {
        url: '/dateRangePicker',
        templateUrl: 'components/dateRangePicker/dateRangePicker.html',
        controller: 'DateRangePickerCtrl'
      });
  });