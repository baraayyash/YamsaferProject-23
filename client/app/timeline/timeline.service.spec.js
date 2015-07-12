'use strict';

describe('Service: timeline', function () {

  // load the service's module
  beforeEach(module('callLogsApp'));

  // instantiate service
  var timeline;
  beforeEach(inject(function (_timeline_) {
    timeline = _timeline_;
  }));

  it('should do something', function () {
    expect(!!timeline).toBe(true);
  });

});
