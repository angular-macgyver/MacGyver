describe('Filter: pluralize', function() {
  var pluralizeFilter, util;

  beforeEach(module('Mac'));
  beforeEach(inject(function($filter, _util_) {
    pluralizeFilter = $filter('pluralize');
    util = _util_;

    spyOn(util, 'pluralize').and.callThrough();
  }));

  it('should call util.pluralize', function() {
    pluralizeFilter('test');
    expect(util.pluralize).toHaveBeenCalled();
  });

  it('should default includeCount to true', function() {
    pluralizeFilter('test', 2);
    expect(util.pluralize).toHaveBeenCalledWith('test', 2, true);
  });
});
