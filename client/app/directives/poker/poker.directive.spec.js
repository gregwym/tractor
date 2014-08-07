'use strict';

describe('Directive: poker', function () {

  // load the directive's module
  beforeEach(module('tractorApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  xit('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<poker></poker>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the poker directive');
  }));
});
