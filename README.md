# MacGyver

Duct Tape and a Swiss Army Knife. Angular helpers for all your friends!

[![Build Status](https://travis-ci.org/StartTheShift/MacGyver.png?branch=master)](https://travis-ci.org/StartTheShift/MacGyver) [![Selenium Test Status](https://saucelabs.com/buildstatus/macgyver-ci)](https://saucelabs.com/u/macgyver-ci)

[![Selenium Test Status](https://saucelabs.com/browser-matrix/macgyver-ci.svg)](https://saucelabs.com/u/macgyver-ci)

## Current components ##

### Directives ###
 - Affix
 - Autocomplete
 - Canvas Spinner
 - Datepicker
 - Events
 - File Upload
 - Menu
 - Modal
 - Placeholder
 - Popover
 - Scroll Spy
 - Spinner
 - Table
 - Tag Autocomplete
 - Time Input
 - Tooltip

### Filters ###
 - Boolean
 - Pluralize
 - Timestamp
 - Underscore String

## 3rd party libraries dependencies ##
Libraries are only needed for a few directives,

 - jQuery (datepicker, table and file upload)
 - jQuery UI (datepicker and table)
 - jQuery File Upload (file upload directive)
 - Underscore String (Underscore string filter)

## Using MacGyver ##
You can install via [Bower](http://www.bower.io) or download from [Github](https://github.com/StartTheShift/MacGyver/archive/master.zip)

To install via bower, make sure you have bower installed and then run:

    bower install angular-macgyver

More bower repositories can be found at [Angular MacGyver](https://github.com/angular-macgyver)

Once you have MacGyver in your project, just include "Mac" as a dependency in your Angular application and you’re good to go.

    angular.module("myModule", ["Mac"])

MacGyver includes multiple scripts,
- `macgyver.js` - All directives, services and filters bundled together
- `macgyver-core.js` - Utilities, events and all directives without 3rd party dependencies
- `macgyver-datepicker.js` - Datepicker with jQuery UI datepicker
- `macgyver-fileupload.js` - Fileupload directive with jQuery UI and jQuery fileupload
- `macgyver-filters.js` - Filters except underscore string filter
- `macgyver-string-filter.js` - Underscore String filter
- `macgyver-table.js` - Table view

## Get Started On Development ##
MacGyver requires a few node modules and bower packages for development environment.

The easiest way to install all requirements,

    ./init-project

### Install all through npm ###

    npm install

#### Install Bower ####

    sudo npm -g install bower

#### Install Grunt ####

    sudo npm -g install grunt-cli

#### Install script dependencies

    bower install

#### Starting Grunt
To compile source code and run unit tests while developing:

    grunt dev

## Authors

**Adrian Lee**
+ <http://twitter.com/adrianthemole>
+ <http://github.com/adrianlee44>

**Colin Kahn**
+ <http://twitter.com/programmingwtf>
+ <http://github.com/colinkahn>
