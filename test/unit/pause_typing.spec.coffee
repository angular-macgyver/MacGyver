describe "Pause typing", ->
  $rootScope = null
  $compile   = null
  $timeout   = null
  keys       = null

  beforeEach module("Mac")
  beforeEach inject (_$compile_, _$timeout_, _$rootScope_, _keys_) ->
    $compile   = _$compile_
    $timeout   = _$timeout_
    $rootScope = _$rootScope_
    keys       = _keys_

  it "should invoke callback", ->
    called              = false
    $rootScope.callback = -> called = true

    input = $compile("<input type='text' mac-pause-typing='callback()' />") $rootScope
    $rootScope.$digest()

    input.trigger $.Event("keyup", which: keys.F)
    input.trigger $.Event("keyup", which: keys.O)
    input.trigger $.Event("keyup", which: keys.O)

    $timeout.flush()

    expect(called).toBe true
