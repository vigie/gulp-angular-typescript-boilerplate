'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var wrench = require('wrench');

// TODO mcritch: move to gulp.config.js
var options = {
   src: 'src',
   dist: 'dist',
   tmp: '.tmp',
   e2e: 'e2e',
   // Returns a function intended to be called by a Node Stream.
   errorHandler: function (title) {
      return function (err) {
         gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
         // All Streams are instances of Node EventEmmitter.
         // The 'end' event indicates no more data to read from the stream.
         this.emit('end');
      };
   },
   // Config for the wiredep module used in gulp/inject.js
   wiredep: {
      directory: 'bower_components'
   }
};

// Requires all modules found under the gulp folder and executes those modules with
// the options object as input.
wrench.readdirSyncRecursive('./gulp').filter(function (file) {
   return (/\.(js|coffee)$/i).test(file);
}).map(function (file) {
   require('./gulp/' + file)(options);
});

// Task: default ------------------------------------------------------------------------
// Deps: clean
// Runs the build task.
gulp.task('default', ['clean'], function () {
   gulp.start('build');
});
