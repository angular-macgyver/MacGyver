exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  modules:
    wrapper: false
    definition: false

  paths:
    public: "lib"
  files:
    javascripts:
      joinTo:
        'angular-util.js': /^app/
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: ['app/main.coffee']

