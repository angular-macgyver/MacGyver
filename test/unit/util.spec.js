describe('Mac Util', function() {
  var util;
  beforeEach(function() {
    module('Mac.Util');
    inject(function($injector) {
      util = $injector.get('util');
    });
  });

  it('should trim string', function() {
    expect(util.trim('    test')).toBe('test');
    expect(util.trim('test    ')).toBe('test');
    expect(util.trim('    test    ')).toBe('test');
  });

  it('should trim when string prototype does not have it', function() {
    var tempTrim = String.prototype.trim;
    String.prototype.trim = null;

    expect(util.trim('    test')).toBe('test');
    expect(util.trim('test    ')).toBe('test');
    expect(util.trim('    test    ')).toBe('test');

    String.prototype.trim = tempTrim;
  });

  it('should capitalize words', function() {
    expect(util.capitalize('hamburger')).toBe('Hamburger');
    expect(util.capitalize('dog house')).toBe('Dog house');
  });

  it('should uncapitalize words', function() {
    expect(util.uncapitalize('Hamburger')).toBe('hamburger');
    expect(util.uncapitalize('Dog House')).toBe('dog House');
  });

  describe('pluralize', function() {
    it('should perform basic pluralization', function() {
      expect(util.pluralize('dog')).toBe('dogs');
      expect(util.pluralize('friend')).toBe('friends');
      expect(util.pluralize('apple')).toBe('apples');
      expect(util.pluralize('hive')).toBe('hives');
    });

    it('should pluralize words with special-case formats', function() {
      expect(util.pluralize('sky')).toBe('skies');
      expect(util.pluralize('mouse')).toBe('mice');
      expect(util.pluralize('query')).toBe('queries');
      expect(util.pluralize('tomato')).toBe('tomatoes');
      expect(util.pluralize('hex')).toBe('hexes');
      expect(util.pluralize('octopus')).toBe('octopi');
      expect(util.pluralize('matrix')).toBe('matrices');
      expect(util.pluralize('dwarf')).toBe('dwarves');
      expect(util.pluralize('status')).toBe('statuses');
      expect(util.pluralize('axis')).toBe('axes');
    });

    it('should pluralize irregular nouns', function() {
      expect(util.pluralize('ox')).toBe('oxen');
      expect(util.pluralize('woman')).toBe('women');
      expect(util.pluralize('person')).toBe('people');
      expect(util.pluralize('child')).toBe('children');
      expect(util.pluralize('goose')).toBe('geese');
    });

    it('should pluralize uncountable nouns', function() {
      expect(util.pluralize('sheep')).toBe('sheep');
      expect(util.pluralize('fish')).toBe('fish');
      expect(util.pluralize('money')).toBe('money');
    });

    it('should pluralize sentences', function() {
      expect(util.pluralize('my friend')).toBe('my friends');
      expect(util.pluralize('this is a good sentence')).toBe('this is a good sentences');
      expect(util.pluralize('i have 100 moose')).toBe('i have 100 moose');
    });

    it('should not pluralize when the count is 1', function() {
      expect(util.pluralize('cat', 1)).toBe('cat');
      expect(util.pluralize('person', 1)).toBe('person');
    });

    it('should prepend the count when asked to during pluralization', function() {
      expect(util.pluralize('house', 5, true)).toBe('5 houses');
      expect(util.pluralize('mouse', 0, true)).toBe('0 mice');
    });

    it('should preserve case when pluralizing', function() {
      expect(util.pluralize('Bus')).toBe('Buses');
      expect(util.pluralize('BACON')).toBe('BACONS');
      expect(util.pluralize('SomeClass')).toBe('SomeClasses');
    });

    it('should not break when pluralizing empty strings or null', function() {
      expect(util.pluralize('')).toBe('');
      expect(util.pluralize(null)).toBe('');
    });

    it('should not break when passing parameter other than string', function() {
      expect(util.pluralize(23)).toBe(23);
    });
  });

  it('should convert strings to camel case', function() {
    expect(util.toCamelCase('my_cool_string')).toBe('myCoolString');
    expect(util.toCamelCase('my-cool-string')).toBe('myCoolString');
  });

  it('should convert strings to snake case', function() {
    expect(util.toSnakeCase('myCoolString')).toBe('my_cool_string');
    expect(util.toSnakeCase('my-cool-string')).toBe('my_cool_string');
  });

  it("should convert an object's keys to camel case", function() {
    var convertedObject, object;
    object = {
      some_property: 'hello',
      another_property: 'hi',
      cool_property: {
        nested_property_a: {
          deep_nested_property: 'hi'
        },
        nested_property_b: 'sup'
      }
    };
    convertedObject = util.convertKeysToCamelCase(object);
    expect(convertedObject.someProperty).toBe('hello');
    expect(convertedObject.anotherProperty).toBe('hi');
    expect(convertedObject.coolProperty.nestedPropertyA.deepNestedProperty).toBe('hi');
    expect(convertedObject.coolProperty.nestedPropertyB).toBe('sup');
  });

  it("should convert an object's keys to snake case", function() {
    var convertedObject, object;
    object = {
      someProperty: 'hello',
      anotherProperty: 'hi',
      coolProperty: {
        nestedPropertyA: {
          deepNestedProperty: 'hi'
        },
        nestedPropertyB: 'sup'
      }
    };
    convertedObject = util.convertKeysToSnakeCase(object);
    expect(convertedObject.some_property).toBe('hello');
    expect(convertedObject.another_property).toBe('hi');
    expect(convertedObject.cool_property.nested_property_a.deep_nested_property).toBe('hi');
    expect(convertedObject.cool_property.nested_property_b).toBe('sup');
  });

  describe('validateUrl', function() {
    it('should validate URL', function() {
      var validObj, validUrl;
      validUrl = 'http://www.macgyver.com';
      validObj = util.validateUrl(validUrl);
      expect(validObj.protocol).toBe('http');
      expect(validObj.subdomain).toBe('www');
      expect(validObj.name).toBe('macgyver');
      expect(validObj.domain).toBe('com');
      expect(validObj.path).toBe('/');
    });

    it('should validate complex URL', function() {
      var validComplexObj, validComplexUrl;
      validComplexUrl = 'https://macgyver.io/cow/make/sound?sound=(moo)&andrian=cool#carey';
      validComplexObj = util.validateUrl(validComplexUrl);
      expect(validComplexObj.protocol).toBe('https');
      expect(validComplexObj.subdomain).toBeUndefined();
      expect(validComplexObj.domain).toBe('io');
      expect(validComplexObj.path).toBe('/cow/make/sound?sound=(moo)&andrian=cool#carey');
    });

    it('should null on invalid URL', function() {
      var invalidUrl;
      invalidUrl = 'http://www';
      expect(util.validateUrl(invalidUrl)).toBe(null);
    });
  });

  describe('validateEmail', function() {
    it('should validate email', function() {
      expect(util.validateEmail('test@example.com')).toBe(true);
      expect(util.validateEmail('test.ing@example.com')).toBe(true);
    });

    it('should false on invalid email', function() {
      expect(util.validateEmail('@example')).toBe(false);
    });
  });

  describe('validateTime', function() {
    var times = ['7:30 PM', '07:30 PM', '02:30 AM', '12:00 AM', '03:16 PM']
    times.forEach(function(time) {
      it('should return an object for valid time(' + time + ')', function() {
        expect(util.validateTime(time)).not.toBe(null);
      });
    });

    var invalidTimes = ['23:12', '21:23AM', '02:67', '25:24', '11:21 TM'];
    invalidTimes.forEach(function(time) {
      it('should return null value for invalid time(' + time + ')', function() {
        expect(util.validateTime(time)).toBe(null);
      });
    });
  });

  it('should the querystring of ', function() {
    var url;
    url = 'http://www.macgyver.com?season=1&episode=5&time=12:32';
    expect(util.getQueryString(url, 'season')).toBe('1');
    expect(util.getQueryString(url, 'episode')).toBe('5');
    expect(util.getQueryString(url, 'time')).toBe('12:32');
  });

  describe('extendAttributes', function() {
    var attrs, attrsWithPrefix, defaults;
    defaults = {
      width: 10,
      height: 20,
      isEnabled: false,
      isShown: true,
      someValue: 10
    };
    attrs = {
      width: 50,
      isEnabled: 'true',
      isShown: 'false',
      someValue: '23'
    };

    attrsWithPrefix = {
      macGyverWidth: 30,
      macGyverHeight: 19
    };

    it('should extend default attributes', function() {
      expect(util.extendAttributes(null, defaults, {width: 50})).toEqual({
        width: 50,
        height: 20,
        isEnabled: false,
        isShown: true,
        someValue: 10
      });
    });

    it('should not replace fasly values', function() {
      expect(util.extendAttributes(null, defaults, {isEnabled: '', isShown: false})).toEqual({
        width: 10,
        height: 20,
        isEnabled: true,
        isShown: false,
        someValue: 10
      });
    });

    it('should extend default attributes when there is a prefix', function() {
      expect(util.extendAttributes('macGyver', defaults, attrsWithPrefix)).toEqual({
        width: 30,
        height: 19,
        isEnabled: false,
        isShown: true,
        someValue: 10
      });
    });

    it('should handle special variable', function () {
      var outputAttrs = util.extendAttributes(null, defaults, attrs);

      expect(outputAttrs.isEnabled).toBe(true);
      expect(outputAttrs.isShown).toBe(false);
      expect(outputAttrs.someValue).toBe(23);
    });
  });

  describe('pythagoras function', function() {
    it('should calculate value correctly', function() {
      expect(util.pyth(3, 4)).toBe(5);
    });
  });

  describe('radian to degree', function() {
    it('should convert radian to degree correctly', function() {
      expect(util.degrees(Math.PI)).toBe(180);
    });
  });

  describe('degree to radian', function() {
    it('should convert degree to radian correctly', function() {
      expect(util.radian(180)).toBe(Math.PI);
    });
  });

  describe('hex to rgb', function() {
    it('should convert 3D9AEB', function () {
      var testRGB = util.hex2rgb('3D9AEB');
      expect(testRGB.r).toBe(61);
      expect(testRGB.g).toBe(154);
      expect(testRGB.b).toBe(235);
    });

    it('should convert #3D9AEB', function () {
      var testRGB = util.hex2rgb('#3D9AEB');
      expect(testRGB.r).toBe(61);
      expect(testRGB.g).toBe(154);
      expect(testRGB.b).toBe(235);
    });

    it('should convert BAC', function () {
      var testRGB = util.hex2rgb('BAC');
      expect(testRGB.r).toBe(187);
      expect(testRGB.g).toBe(170);
      expect(testRGB.b).toBe(204);
    });

    it('should convert #BAC', function () {
      var testRGB = util.hex2rgb('#BAC');
      expect(testRGB.r).toBe(187);
      expect(testRGB.g).toBe(170);
      expect(testRGB.b).toBe(204);
    });
  });

  describe('getCssVendorName', function () {
    var testEl = angular.element('<div />')[0];

    // NOTE: This is browser dependent
    it('should get the css key with vendor prefix', function () {
      var name = util.getCssVendorName(testEl, 'animation');
      expect(name).toBeDefined();
    });

    it('should fallback to the passed in value', function () {
      var name = util.getCssVendorName(testEl, 'doesNotExist');
      expect(name).toBe('doesNotExist');
    });

    it('should return with vendor prefix', function () {
      testEl.style['webkitAnimation'] = 'test';
      var name = util.getCssVendorName(testEl, 'animation');
      expect(name).toBe('webkitAnimation');
    });
  });
});
