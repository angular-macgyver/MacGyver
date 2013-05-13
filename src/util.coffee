##
## Util module
##
## Contains various miscellaneous utility functions and extensions.
##

util = angular.module "Mac.Util", []

# Expose an object with a bunch of utility functions on it.
util.factory "util", [
  "$filter"
  (
    $filter
  ) ->
    # Underscore function section
    ArrayProto    = Array.prototype
    ObjProto      = Object.prototype
    FuncProto     = Function.prototype
    toString      = ObjProto.toString
    nativeIsArray = Array.isArray

    _inflectionConstants:
      uncountables: [
        "sheep", "fish", "moose", "series", "species", "money", "rice", "information", "info", "equipment", "min"
      ]

      irregulars:
        child:  "children"
        man:    "men"
        woman:  "women"
        person: "people"
        ox:     "oxen"
        goose:  "geese"

      pluralizers: [
        [/(quiz)$/i,                 "$1zes"  ]
        [/([m|l])ouse$/i,            "$1ice"  ]
        [/(matr|vert|ind)(ix|ex)$/i, "$1ices" ]
        [/(x|ch|ss|sh)$/i,           "$1es"   ]
        [/([^aeiouy]|qu)y$/i,        "$1ies"  ]
        [/(?:([^f])fe|([lr])f)$/i,   "$1$2ves"]
        [/sis$/i,                    "ses"    ]
        [/([ti])um$/i,               "$1a"    ]
        [/(buffal|tomat)o$/i,        "$1oes"  ]
        [/(bu)s$/i,                  "$1ses"  ]
        [/(alias|status)$/i,         "$1es"   ]
        [/(octop|vir)us$/i,          "$1i"    ]
        [/(ax|test)is$/i,            "$1es"   ]
        [/x$/i,                      "xes"    ]
        [/s$/i,                      "s"      ]
        [/$/,                        "s"      ]
      ]

    pluralize: (string, count, includeCount = false) ->
      # If our string has no length, return without further processing
      return string unless string?.trim().length > 0

      # If the user is expecting count to be anything other
      # than the default, check if it is actually a number
      # If not, return an empty string
      if includeCount and isNaN +count
        return ""

      # Manually set our default here
      count = 2 unless count?

      {pluralizers, uncountables, irregulars} = @_inflectionConstants

      word           = string.split(/\s/).pop()
      isUppercase    = word.toUpperCase() is word
      lowercaseWord  = word.toLowerCase()
      pluralizedWord = if count is 1 or uncountables.indexOf(lowercaseWord) >= 0 then word else null

      unless pluralizedWord?
        pluralizedWord = irregulars[lowercaseWord] if irregulars[lowercaseWord]?

      unless pluralizedWord?
        for pluralizer in pluralizers when pluralizer[0].test lowercaseWord
          pluralizedWord = word.replace pluralizer[0], pluralizer[1]
          break

      pluralizedWord or = word
      pluralizedWord    = pluralizedWord.toUpperCase() if isUppercase
      pluralizedString  = string[0...-word.length] + pluralizedWord
      if includeCount then "#{$filter("number") count} #{pluralizedString}" else pluralizedString

    capitalize:   (string) -> string[0].toUpperCase() + string[1..]
    uncapitalize: (string) -> string[0].toLowerCase() + string[1..]

    isArray: nativeIsArray or (obj) -> toString.call(obj) is "[object Array]"

    ##
    ## @name
    ## extendAttributes
    ##
    ## @description
    ## Extend default values with attributes
    ##
    ## @param {String} prefix Prefix of all attributes
    ## @param {Object} defaults Default set of attributes
    ## @param {Object} attributes User set attributes
    ##
    extendAttributes: (prefix, defaults, attributes) ->
      output = {}
      for own key, value of defaults
        key         = @capitalize(key) if prefix
        macKey      = "#{prefix}#{key}"
        output[key] =
          if attributes[macKey]?
            attributes[macKey] or true
          else
            value

        # Convert to true boolean if passing in boolean string
        if output[key] in ["true", "false"]
          output[key] = output[key] is "true"
        # Convert to integer or numbers from strings
        else if output[key]?.length > 0 and not isNaN +output[key]
          output[key] = +output[key]

      return output
]



