describe('Filter: list', function() {
  var listFilter;

  beforeEach(module('Mac'));
  beforeEach(inject(function($filter) {
    listFilter = $filter('list');
  }));

  it('should format an array into a string', function() {
    expect(listFilter([1, 2, 3, 4])).toBe('1, 2, 3, 4');
  });

  it('should format an array into a string with a custom separator', function() {
    expect(listFilter([1, 2, 3], '|')).toBe('1|2|3');
  });

  it('should return the input when it is not array', function() {
    expect(listFilter('1,2,3')).toBe('1,2,3');
  });
});
