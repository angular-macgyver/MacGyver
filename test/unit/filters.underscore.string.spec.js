describe('Filter: Underscore string', function() {
  var underscoreFilter;

  beforeEach(module('Mac'));
  beforeEach(inject(function($injector) {
    underscoreFilter = $injector.get('underscoreStringFilter');
  }));

  it('should call _.string', function() {
    spyOn(_.string, 'capitalize').and.callThrough();

    underscoreFilter('hello', 'capitalize');
    expect(_.string.capitalize).toHaveBeenCalledWith('hello');
  });
});
