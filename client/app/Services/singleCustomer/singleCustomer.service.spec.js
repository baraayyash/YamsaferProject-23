'use strict';

describe('Service: singleCustomer', function () {

  // load the service's module
  beforeEach(module('internsApp'));

  // instantiate service
  var singleCustomer;
  beforeEach(inject(function (_singleCustomer_) {
    singleCustomer = _singleCustomer_;
  }));

  it('should do something', function () {
    expect(!!singleCustomer).toBe(true);
  });

});
