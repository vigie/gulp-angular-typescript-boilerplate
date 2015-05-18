'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function (options) {
   // Task: inject ----------------------------------------------------------------------
   // Deps: scripts, styles
   // Injects 1st and 3rd party js and css files into index.html.
   gulp.task('inject', ['scripts', 'styles'], function () {
      var injectStyles = gulp.src([
            options.tmp + '/serve/app/**/*.css',
            '!' + options.tmp + '/serve/app/vendor.css'
      ], { read: false });

      var sortOutput = require('../' + options.tmp + '/sortOutput.json');

      // Stream of scripts to inject in the order set out by sortOutput.json
      var injectScripts = gulp.src([
            '{' + options.src + ',' + options.tmp + '/serve}/app/**/*.js',
            '!' + options.src + '/app/**/*.spec.js',
            '!' + options.src + '/app/**/*.mock.js'
      ], { read: false })
      .pipe($.order(sortOutput, {base: options.tmp + '/serve/app'}));

      var injectOptions = {
         ignorePath: [options.src, options.tmp + '/serve'],
         addRootSlash: false
      };

      return gulp.src(options.src + '/*.html')
         // Inject our css files
         .pipe($.inject(injectStyles, injectOptions))
         // Inject out js files
         .pipe($.inject(injectScripts, injectOptions))
         // Inject 3rd party js and css files
         .pipe(wiredep(options.wiredep))
         // Write modified index.html to staging directory.
         .pipe(gulp.dest(options.tmp + '/serve'));
   });
};
