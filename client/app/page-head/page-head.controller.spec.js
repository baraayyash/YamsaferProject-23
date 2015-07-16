'use strict';

describe('Controller: PageHeadCtrl', function () {

  // load the controller's module
  beforeEach(module('internsApp'));

  var PageHeadCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PageHeadCtrl = $controller('PageHeadCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
