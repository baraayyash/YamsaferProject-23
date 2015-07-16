'use strict';

angular.module('internsApp')
  .controller('NavbarCtrl', function($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
   
    if($scope.open==null){
      $scope.open=1;

    }


    $scope.change = function(open) {
      $scope.open = open;
    };

    $scope.isChanged = function(open) {
      return ($scope.open == open);
    };


    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });