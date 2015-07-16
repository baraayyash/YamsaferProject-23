'use strict';

describe('Controller: ComponentsRoundedCtrl', function () {

  // load the controller's module
  beforeEach(module('internsApp'));

  var ComponentsRoundedCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ComponentsRoundedCtrl = $controller('ComponentsRoundedCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
