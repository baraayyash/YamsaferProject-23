'use strict';

describe('Controller: DateRangePickerCtrl', function () {

  // load the controller's module
  beforeEach(module('internsApp'));

  var DateRangePickerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DateRangePickerCtrl = $controller('DateRangePickerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
