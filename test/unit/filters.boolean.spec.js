describe('Filter: boolean', function() {
  var booleanFilter;

  beforeEach(module('Mac'));
  beforeEach(inject(function($filter){
    booleanFilter = $filter('boolean');
  }));

  it('should return true string', function() {
    expect(booleanFilter(true, 'show this', 'not this'), 'show this');
  });

  it('should return false string', function() {
    expect(booleanFilter(false, 'nop', 'but this'), 'but this');
  });

  it('should return default true string', function() {
    expect(booleanFilter(true), 'true');
  });

  it('should return default false string', function() {
    expect(booleanFilter(false), 'false');
  });
});

describe('Filter: true', function() {
  var trueFilter;

  beforeEach(module('Mac'));
  beforeEach(inject(function($filter) {
    trueFilter = $filter('true');
  }));

  it('should return true string', function() {
    expect(trueFilter(true, 'show this'), 'show this');
  });

  it('should return empty string', function() {
    expect(trueFilter(false, 'nop'), '');
  });

  it('should return default true text', function() {
    expect(trueFilter(true), 'true');
  });
});

describe('Filter: false', function() {
  var falseFilter;

  beforeEach(module('Mac'));
  beforeEach(inject(function($filter) {
    falseFilter = $filter('false');
  }));

  it('should return false string', function() {
    expect(falseFilter(false, 'show this'), 'show this');
  });

  it('should return empty string', function() {
    expect(falseFilter(true, 'nop'), '');
  });

  it('should return default true text', function() {
    expect(falseFilter(false), 'false');
  });
});
