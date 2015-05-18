'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

function isOnlyChange(event) {
   return event.type === 'changed';
}

module.exports = function (options) {

   // Task: watch------------------------------------------------------------------------
   // Deps: inject
   // * When either the index.html or bower.json files change, re-run inject task.
   // * When style files change, re-transpile or re-inject files as necessary.
   // * When any of the ts/js files change, re-transpile or re-inject files as necessary.
   // * When any html files change, re-load the app.
   gulp.task('watch', ['inject'], function () {

      gulp.watch([options.src + '/*.html', 'bower.json'], ['inject']);

      gulp.watch([
            options.src + '/app/**/*.css',
            options.src + '/app/**/*.scss'
      ], function (event) {
         if (isOnlyChange(event)) {
            // If source code changed, re-transpile css
            gulp.start('styles');
         } else {
            // Else just update references
            gulp.start('inject');
         }
      });

      gulp.watch([
            options.src + '/app/**/*.js',
            options.src + '/app/**/*.ts'
      ], function (event) {
         if (isOnlyChange(event)) {
            gulp.start('scripts');
         } else {
            gulp.start('inject');
         }
      });

      gulp.watch(options.src + '/app/**/*.html', function (event) {
         browserSync.reload(event.path);
      });
   });
};
