describe('Pause typing', function() {
  var $compile, $rootScope, $timeout, keys;

  beforeEach(module('Mac'));
  beforeEach(inject(function(_$compile_, _$timeout_, _$rootScope_, _keys_) {
    $compile = _$compile_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    keys = _keys_;
  }));
  
  it('should invoke callback', function() {
    var input;
    $rootScope.callback = jasmine.createSpy('callback');
    input = $compile('<input type="text" mac-pause-typing="callback()" />')($rootScope);
    
    $rootScope.$digest();
    
    input.triggerHandler({
      type: 'keyup',
      which: keys.F
    });
    input.triggerHandler({
      type: 'keyup',
      which: keys.O
    });
    input.triggerHandler({
      type: 'keyup',
      which: keys.O
    });
    $timeout.flush();
    expect($rootScope.callback).toHaveBeenCalled();
  });
});