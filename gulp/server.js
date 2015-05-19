'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

module.exports = function (config, options) {

   function browserSyncInit(baseDir, browser) {
      browser = browser === undefined ? 'default' : browser;

      var routes = null;
      if (baseDir === config.src || (util.isArray(baseDir) && baseDir.indexOf(config.src) !== -1)) {
         routes = {
            '/bower_components': 'bower_components'
         };
      }

      var server = {
         baseDir: baseDir,
         routes: routes
      };

      if (options.useProxy) {
         server.middleware = require('./proxy');
      }

      browserSync.instance = browserSync.init({
         startPath: '/',
         server: server,
         browser: browser
      });
   }

   browserSync.use(browserSyncSpa({
      selector: '[ng-app]'// Only needed for angular apps
   }));

   // Task: serve------------------------------------------------------------------------
   // Deps: watch
   // Serves the app from the default location which is the staging directory.
   gulp.task('serve', ['watch'], function () {
      browserSyncInit([config.tmp + '/serve', config.src]);
   });

   // Task: serve:dist-------------------------------------------------------------------
   // Deps: build
   // Serves the optimized version of the app from the distribution folder.
   // Note there is no watch on these files
   gulp.task('serve:dist', ['build'], function () {
      browserSyncInit(config.dist);
   });

   gulp.task('serve:e2e', ['inject'], function () {
      browserSyncInit([config.tmp + '/serve', config.src], []);
   });

   gulp.task('serve:e2e-dist', ['build'], function () {
      browserSyncInit(config.dist, []);
   });
};
