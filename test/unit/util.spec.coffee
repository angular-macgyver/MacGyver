describe "Mac Util", ->
  # A reference to the util object to be used in each test.
  util = null

  beforeEach ->
    # Load up dependent modules.
    module "Mac.Util"

    # Grab services.
    inject ($injector) ->
      util = $injector.get "util"

  it "should capitalize words", ->
    expect(util.capitalize "hamburger").toBe "Hamburger"
    expect(util.capitalize "dog house").toBe "Dog house"

  it "should uncapitalize words", ->
    expect(util.uncapitalize "Hamburger").toBe "hamburger"
    expect(util.uncapitalize "Dog House").toBe "dog House"

  it "should perform basic pluralization", ->
    expect(util.pluralize "dog").toBe    "dogs"
    expect(util.pluralize "friend").toBe "friends"
    expect(util.pluralize "apple").toBe  "apples"
    expect(util.pluralize "hive").toBe   "hives"

  it "should pluralize words with special-case formats", ->
    expect(util.pluralize "sky").toBe     "skies"
    expect(util.pluralize "mouse").toBe   "mice"
    expect(util.pluralize "query").toBe   "queries"
    expect(util.pluralize "tomato").toBe  "tomatoes"
    expect(util.pluralize "hex").toBe     "hexes"
    expect(util.pluralize "octopus").toBe "octopi"
    expect(util.pluralize "matrix").toBe  "matrices"
    expect(util.pluralize "dwarf").toBe   "dwarves"
    expect(util.pluralize "status").toBe  "statuses"
    expect(util.pluralize "axis").toBe    "axes"

  it "should pluralize irregular nouns", ->
    expect(util.pluralize "ox").toBe     "oxen"
    expect(util.pluralize "woman").toBe  "women"
    expect(util.pluralize "person").toBe "people"
    expect(util.pluralize "child").toBe  "children"
    expect(util.pluralize "goose").toBe  "geese"

  it "should pluralize uncountable nouns", ->
    expect(util.pluralize "sheep").toBe "sheep"
    expect(util.pluralize "fish").toBe  "fish"
    expect(util.pluralize "money").toBe "money"

  it "should pluralize sentences", ->
    expect(util.pluralize "my friend").toBe               "my friends"
    expect(util.pluralize "this is a good sentence").toBe "this is a good sentences"
    expect(util.pluralize "i have 100 moose").toBe        "i have 100 moose"

  it "should not pluralize when the count is 1", ->
    expect(util.pluralize "cat", 1).toBe    "cat"
    expect(util.pluralize "person", 1).toBe "person"

  it "should prepend the count when asked to during pluralization", ->
    expect(util.pluralize "house", 5, true).toBe "5 houses"
    expect(util.pluralize "mouse", 0, true).toBe "0 mice"

  it "should preserve case when pluralizing", ->
    expect(util.pluralize "Bus").toBe       "Buses"
    expect(util.pluralize "BACON").toBe     "BACONS"
    expect(util.pluralize "SomeClass").toBe "SomeClasses"

  it "should not break when pluralizing empty strings or null", ->
    expect(util.pluralize "").toBe   ""
    expect(util.pluralize null).toBe null

  it "should convert strings to camel case", ->
    expect(util.toCamelCase "my_cool_string").toBe "myCoolString"
    expect(util.toCamelCase "my-cool-string").toBe "myCoolString"

  it "should convert strings to snake case", ->
    expect(util.toSnakeCase "myCoolString").toBe   "my_cool_string"
    expect(util.toSnakeCase "my-cool-string").toBe "my_cool_string"

  it "should convert an object's keys to camel case", ->
    object =
      some_property:    "hello"
      another_property: "hi"
      cool_property:
        nested_property_a:
          deep_nested_property: "hi"
        nested_property_b: "sup"

    convertedObject = util.convertKeysToCamelCase object

    expect(convertedObject.someProperty).toBe "hello"
    expect(convertedObject.anotherProperty).toBe "hi"
    expect(convertedObject.coolProperty.nestedPropertyA.deepNestedProperty).toBe "hi"
    expect(convertedObject.coolProperty.nestedPropertyB).toBe "sup"

  it "should convert an object's keys to snake case", ->
    object =
      someProperty:    "hello"
      anotherProperty: "hi"
      coolProperty:
        nestedPropertyA:
          deepNestedProperty: "hi"
        nestedPropertyB: "sup"

    convertedObject = util.convertKeysToSnakeCase object

    expect(convertedObject.some_property).toBe "hello"
    expect(convertedObject.another_property).toBe "hi"
    expect(convertedObject.cool_property.nested_property_a.deep_nested_property).toBe "hi"
    expect(convertedObject.cool_property.nested_property_b).toBe "sup"

  it "should validate URL", ->
    validUrl = "http://www.macgyver.com"

    validObj = util.validateUrl validUrl
    expect(validObj.protocol).toBe "http://"
    expect(validObj.subdomain).toBe "www"
    expect(validObj.name).toBe "macgyver"
    expect(validObj.domain).toBe "com"
    expect(validObj.path).toBe "/"

  it "should return null on invalid URL", ->
    invalidUrl = "http://www"
    expect(util.validateUrl invalidUrl).toBe null

  it "should validate email", ->
    expect(util.validateEmail "test@example.com").toBe true
    expect(util.validateEmail "test.ing@example.com").toBe true

  it "should return false on invalid email", ->
    expect(util.validateEmail "@example").toBe false

  it "should return the querystring of ", ->
    url = "http://www.macgyver.com?season=1&episode=5&time=12:32"

    expect(util.getQueryString url, "season").toBe "1"
    expect(util.getQueryString url, "episode").toBe "5"
    expect(util.getQueryString url, "time").toBe "12:32"

  describe "extendAttributes", ->
    defaults =
      width:  10
      height: 20

    attrs =
      width: 50

    attrsWithPrefix =
      macGyverWidth: 30

    it "should extend default attributes", ->
      expect(util.extendAttributes null, defaults, attrs).toEqual
        width: 50, height: 20

    it "should extend default attributes when there is a prefix", ->
      expect(util.extendAttributes "macGyver", defaults, attrsWithPrefix).toEqual
        width: 30, height:20


