'use strict';

var gulp = require('gulp');
var wrench = require('wrench');
var minimist = require('minimist');
var Config = require('./gulpfile.config');

var config = new Config();

// The available command line options
var definedOptions = {
   string: 'env',
   boolean: 'useProxy',
   default: {
      env: 'production',
      useProxy: false
   }
};

// The runtime command line options.
var options = minimist(process.argv.slice(2), definedOptions);

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
