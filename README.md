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

## 3rd party libraries dependencies ##
 - Underscore
 - jQuery
 - jQuery UI

## Get Started ##
MacGyver requires a few node modules for developer environment.

#### Install Coffeescript ####

  `sudo npm -g install coffee-script`

#### Install Brunch ####

  `sudo npm -g install brunch`

#### Install testacular ####

  `sudo npm -g install testacular`

#### Install bower ####

  `sudo npm -g install bower`

#### Other dependencies ####
  Includes [underscore](https://npmjs.org/package/underscore),
           [wrench](https://npmjs.org/package/wrench),
           [express](https://npmjs.org/package/express),
           [http-proxy](https://npmjs.org/package/http-proxy)

  `npm install`

## Cake commands ##

```
cake update:paths         # Update bower paths file
cake test                 # Run tests with testacular
cake watch                # Proxy brunch watch
cake build:images         # Copy images to build directory
cake build                # Build the latest MacGyver
```
