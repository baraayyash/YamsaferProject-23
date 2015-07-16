'use strict';

describe('Controller: FindByUDIDCtrlCtrl', function() {

  // load the controller's module
  beforeEach(module('internsApp'));

  var FindByUDIDCtrlCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    FindByUDIDCtrlCtrl = $controller('FindByUDIDCtrlCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});