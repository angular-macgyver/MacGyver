describe('Keydown event', function() {
  var $rootScope, $compile, keys;
  
  beforeEach(module('Mac'));
  beforeEach(inject(function(_$compile_, _$rootScope_, _keys_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    keys = _keys_;
  }));
  
  var keydownEvents = ['enter', 'escape', 'space', 'left', 'up', 'right', 'down'];
  
  keydownEvents.forEach(function(key) {
    it('should trigger callback for ' + key + ' key', function() {
      $rootScope.callback = jasmine.createSpy(key);
      
      var input = $compile('<input type="text" mac-keydown-' + key + '="callback()">')($rootScope);
      $rootScope.$digest();
      
      input.triggerHandler({
        type: 'keydown',
        which: keys[key.toUpperCase()]
      });
      
      expect($rootScope.callback).toHaveBeenCalled();
    });
  });
});