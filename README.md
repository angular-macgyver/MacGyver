# MacGyver [![Build Status](https://travis-ci.org/StartTheShift/MacGyver.png?branch=master)](https://travis-ci.org/StartTheShift/MacGyver)

Duct Tape and a Swiss Army Knife. Angular helpers for all your friends!

## Current components ##

### Directives ###
 - Autocomplete
 - Datepicker
 - Events
 - File Upload
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
 - jQuery
 - jQuery UI (datepicker and table)
 - jQuery File Upload (file upload directive)
 - Underscore String (Underscore string filter)

## Using MacGyver ##
You can install via [Bower](http://www.bower.io) or download from [Github](https://github.com/StartTheShift/MacGyver/archive/master.zip)

To install via bower, make sure you have bower installed and then run:

    bower install angular-macgyver

Once you have MacGyver in your project, just include “Mac” as a dependency in your Angular application and you’re good to go.

    angular.module(‘myModule’, [“Mac”])

## Get Started On Development ##
MacGyver requires a few node modules for development environment.

### Install all through npm ###

  `npm install`

#### Install bower ####

  `sudo npm -g install bower`

#### Install Grunt ####

  `sudo npm -g install grunt-cli`

#### Starting Grunt
To compile source code and run unit tests while developing:

    grunt run
