'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var minimist = require('minimist');
var optional = require('optional');
var Config = require('./gulpfile.config');
var _ = require('lodash');

var config = new Config();

// The available command line options
var definedOptions = {
   string: 'env',
   boolean: 'useProxy'
};

// Runtime options coming from optional user's local options file
var options = optional('./gulpfile.options');
// Any runtime command line options.
var commandLineOptions = minimist(process.argv.slice(2), definedOptions);
// Allow command line to take precedence over options file.
options = _.extend({}, options, commandLineOptions);

// Requires all modules found under the gulp folder and executes those modules with
// the options object as input.
wrench.readdirSyncRecursive('./gulp').filter(function (file) {
   return (/\.(js|coffee)$/i).test(file) && file !== 'proxy.js';
}).map(function (file) {
   require('./gulp/' + file)(config, options);
});

// Task: default ------------------------------------------------------------------------
// Deps: clean
// Runs the build task.
gulp.task('default', ['clean'], function () {
   gulp.start('build');
});
