'use strict';

describe('Service: mixPanelService', function () {

  // load the service's module
  beforeEach(module('internsApp'));

  // instantiate service
  var mixPanelService;
  beforeEach(inject(function (_mixPanelService_) {
    mixPanelService = _mixPanelService_;
  }));

  it('should do something', function () {
    expect(!!mixPanelService).toBe(true);
  });

});
