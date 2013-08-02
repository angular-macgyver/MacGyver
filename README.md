# MacGyver #

![MacGyver utils for Angular.js](http://upload.wikimedia.org/wikipedia/en/9/92/MacGyver_intro.jpg "Duct Tape and a Swiss Army Knife")

Angular helpers for all your friends!

## Current components ##

### Directives ###
 - Autocomplete
 - Datepicker
 - Events
 - File Uplaod
 - Menu
 - Modal
 - Spinner
 - Table
 - Tag Autocomplete
 - Tag Input
 - Time input
 - Tooltip

### Filters ###
 - Boolean
 - Pluralize
 - Timestamp
 - Underscore String

## 3rd party libraries dependencies ##
 - Underscore
 - jQuery
 - jQuery UI

## Get Started ##
MacGyver requires a few node modules for development environment.

### Install all through npm ###

  `npm install`

#### Install bower ####

  `sudo npm -g install bower`

#### Install Grunt ####

  `sudo npm -g install grunt-cli`

#### Other dependencies ####
  Includes [underscore](https://npmjs.org/package/underscore),
           [wrench](https://npmjs.org/package/wrench),
           [express](https://npmjs.org/package/express),
           [http-proxy](https://npmjs.org/package/http-proxy)

  `npm install -d`

## Grunt tasks ##

```
       chalkboard  A simple grunt task to make documentation easier. *
            clean  Clean files and folders. *
           coffee  Compile CoffeeScript files into JavaScript *
           concat  Concatenate files. *
             copy  Copy files. *
             jade  Compile jade templates. *
           stylus  Compile Stylus files into CSS *
           uglify  Minify files with UglifyJS. *
            watch  Run predefined tasks whenever watched files change.
            karma  run karma. *
    embedtemplate  Replace templateUrl with actual html *
           marked  Convert markdown to html *
 update:component  Update bower.json
           deploy  Build and copy to lib/
          compile  Compile files
              run  Watch src and run test server
           server  Run test server
```
