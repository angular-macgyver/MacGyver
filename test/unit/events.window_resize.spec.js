describe('Window resize', function() {
  var $compile, $rootScope, $window;

  beforeEach(module('Mac'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _$window_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
  }));

  it('should invoke callback', function() {
    $rootScope.callback = jasmine.createSpy('callback');
    $compile('<div mac-window-resize="callback()"></div>')($rootScope);

    $rootScope.$digest();

    angular.element($window).triggerHandler({
      type: 'resize'
    });

    $rootScope.$digest();

    expect($rootScope.callback).toHaveBeenCalled();
  });

  it('should not invoke callback when scope is destroyed', function() {
    $rootScope.callback = jasmine.createSpy('callback');
    $compile('<div mac-window-resize="callback()"></div>')($rootScope);

    $rootScope.$digest();

    $rootScope.$destroy();

    $rootScope.$digest();

    angular.element($window).triggerHandler({
      type: 'resize'
    });

    $rootScope.$digest();

    expect($rootScope.callback).not.toHaveBeenCalled();
  });

  it('should invoke both callbacks', function() {
    var anotherScope = $rootScope.$new(true);

    $rootScope.callback = jasmine.createSpy('callback 1');
    anotherScope.callback = jasmine.createSpy('callback 2');

    $compile('<div mac-window-resize="callback()"></div>')($rootScope);
    $compile('<div mac-window-resize="callback()"></div>')(anotherScope);

    $rootScope.$digest();

    angular.element($window).triggerHandler({
      type: 'resize'
    });

    $rootScope.$digest();

    expect($rootScope.callback).toHaveBeenCalled();
    expect(anotherScope.callback).toHaveBeenCalled();
  });
});
