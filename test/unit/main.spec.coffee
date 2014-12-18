describe "Mac main", ->
  $rootScope = null
  
  beforeEach module("Mac")
  beforeEach inject (_$rootScope_) ->
    $rootScope = _$rootScope_
  
  describe "isScope", ->
    it "should be an Angular public method", ->
      expect(angular.isScope).toBeDefined()
      
    it "should return false on normal object", ->
      expect(angular.isScope({})).toBe false
      
    it "should return true for Angular scope", ->
      expect(angular.isScope($rootScope)).toBe true
    
  