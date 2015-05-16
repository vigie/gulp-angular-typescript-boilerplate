'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var path = require('path');
var tsd = require('tsd');

var tsdJson = 'tsd.json';
// See https://github.com/Definitelytyped/tsd#readme
var tsdApi = new tsd.getAPI(tsdJson);

module.exports = function () {

   // Task: tsd:install -----------------------------------------------------------------
   // Uses the tsd module to attempt to install ts type definition files for all
   // bower dependencies.
   gulp.task('tsd:install', function () {
      var bower = require(path.join(process.cwd(), 'bower.json'));

      var dependencies = [].concat(
         Object.keys(bower.dependencies),
         Object.keys(bower.devDependencies)
      );

      var query = new tsd.Query();
      dependencies.forEach(function (dependency) {
         query.addNamePattern(dependency);
      });

      var options = new tsd.Options();
      options.resolveDependencies = true;
      options.overwriteFiles = true;
      options.saveBundle = true;

      return tsdApi.readConfig()
         // Query tsd database for dependencies
         .then(function () {
            return tsdApi.select(query, options);
         })
         // Install found definition files
         .then(function (selection) {
            return tsdApi.install(selection, options);
         })
         // Report on result
         .then(function (installResult) {
            var written = Object.keys(installResult.written.dict);
            var removed = Object.keys(installResult.removed.dict);
            var skipped = Object.keys(installResult.skipped.dict);

            written.forEach(function (dts) {
               gutil.log('Definition file written: ' + dts);
            });

            removed.forEach(function (dts) {
               gutil.log('Definition file removed: ' + dts);
            });

            skipped.forEach(function (dts) {
               gutil.log('Definition file skipped: ' + dts);
            });
         });
   });

   // Task: tsd:purge -------------------------------------------------------------------
   // Forcefully removes global HTTP cache files.
   gulp.task('tsd:purge', function () {
      return tsdApi.purge(true, true);
   });

   // Task: tsd--------------------------------------------------------------------------
   // Deps: tsd:install
   gulp.task('tsd', ['tsd:install']);
};
