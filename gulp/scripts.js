'use strict';

var gulp = require('gulp');
// Automatically copies changed files to the server and refreshes all browsers.
var browserSync = require('browser-sync');
// Makes directories and parent directories as necessary (mkdir -p)
var mkdirp = require('mkdirp');

var $ = require('gulp-load-plugins')();

module.exports = function (options) {

   // Task: scripts ---------------------------------------------------------------------
   // Deps: tsd:install
   // * Lints typescript files.
   // * Compiles typescript files to javascript with embedded source maps.
   // * Writes temporary file "sortOutput.json" containing the js files in concat order.
   // * Writes javascript files to temporary staging folder.
   // * Reloads browsers.
   // * Reports on file sizes.
   gulp.task('scripts', ['tsd:install'], function () {
      mkdirp.sync(options.tmp);

      return gulp.src(options.src + '/app/**/*.ts')
         // Start receiving source map data from the plugins that follow.
         .pipe($.sourcemaps.init())
         // Lint the typescript files
         .pipe($.tslint())
         // Output the result of the tslint using the prose reporter.
         .pipe($.tslint.report('prose', { emitError: false }))
         // Generate javascript from the typescript files, in correct order for concat
         .pipe($.typescript({sortOutput: true})).on('error', options.errorHandler('TypeScript'))
         // Write the generated source map data to the bottom of the generated js files.
         .pipe($.sourcemaps.write())
         // Write the names of the generated js files to a temporary file
         .pipe($.toJson({filename: options.tmp + '/sortOutput.json', relative: true}))
         // Write the javascript files to a temporary staging directory
         .pipe(gulp.dest(options.tmp + '/serve/app'))
         // Reloads all browsers with latest js files.
         .pipe(browserSync.reload({ stream: true }))
         // Report on the size of the generated js files.
         .pipe($.size());
   });
};
