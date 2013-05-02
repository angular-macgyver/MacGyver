# MacGyver #

![MacGyver utils for Angular.js](http://upload.wikimedia.org/wikipedia/en/9/92/MacGyver_intro.jpg "Duct Tape and a Swiss Army Knife")

Angular helpers for all your friends!

## Current components ##

### Directives ###
 - Autocomplete
 - Datepicker
 - Events
 - File Uplaod
 - Spinner
 - Table
 - Tag Autocomplete
 - Tag Input
 - Time input

### Filters ###
 - Boolean
 - Pluralize
 - Timestamp
 - Underscore String

## 3rd party libraries dependencies ##
 - Underscore
 - jQuery
 - jQuery UI
 - Spin.js

## Get Started ##
MacGyver requires a few node modules for developer environment.

### Install all through npm ###

  `npm install -d`

### Install manually ###
Install each package one by one

#### Install Coffeescript ####

  `sudo npm -g install coffee-script`

#### Install Grunt CLI ####

  `sudo npm -g install grunt-cli`

#### Install testacular ####

  `sudo npm -g install testacular`

#### Install bower ####

  `sudo npm -g install bower`

#### Other dependencies ####
  Includes [underscore](https://npmjs.org/package/underscore),
           [wrench](https://npmjs.org/package/wrench),
           [express](https://npmjs.org/package/express),
           [http-proxy](https://npmjs.org/package/http-proxy)

  `npm install -d`

## Grunt tasks ##

```
           coffee  Compile CoffeeScript files into JavaScript *
           concat  Concatenate files. *
           stylus  Compile Stylus files into CSS *
             jade  Compile Jade templates into HTML. *
             copy  Copy files. *
            clean  Clean files and folders. *
            watch  Run predefined tasks whenever watched files change.
           uglify  Minify files with UglifyJS. *
       embed:html  Replace templateUrl with actual html
 update:component  Update component.json for bower
           deploy  Build and copy to lib/
          compile  Compile files
             test  Run testacular for unit tests
              run  Watch src and run test server
           server  Run test server
```
