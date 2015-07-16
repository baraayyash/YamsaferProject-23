'use strict';

describe('Controller: SingleCustomerCtrl', function () {

  // load the controller's module
  beforeEach(module('internsApp'));

  var SingleCustomerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SingleCustomerCtrl = $controller('SingleCustomerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
