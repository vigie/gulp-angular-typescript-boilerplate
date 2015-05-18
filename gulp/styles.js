'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

module.exports = function (options) {

   // Task: styles ----------------------------------------------------------------------
   //
   gulp.task('styles', function () {
      var sassOptions = {
         style: 'expanded'
      };

      var injectFiles = gulp.src([
            options.src + '/app/**/*.scss',
            '!' + options.src + '/app/index.scss',
            '!' + options.src + '/app/vendor.scss'
      ], { read: false });

      var injectOptions = {
         transform: function (filePath) {
            filePath = filePath.replace(options.src + '/app/', '');
            return '@import \'' + filePath + '\';';
         },
         starttag: '// injector',
         endtag: '// endinjector',
         addRootSlash: false
      };

      var indexFilter = $.filter('index.scss');
      var vendorFilter = $.filter('vendor.scss');
      var cssFilter = $.filter('**/*.css');

      return gulp.src([
            options.src + '/app/index.scss',
            options.src + '/app/vendor.scss'
      ])
      // Inject dependent scss files to index.scss
      .pipe(indexFilter)
      .pipe($.inject(injectFiles, injectOptions))
      .pipe(indexFilter.restore())
      // Inject dependent scss files to vendor.scss
      .pipe(vendorFilter)
      .pipe(wiredep(options.wiredep))
      .pipe(vendorFilter.restore())
      // Compile the scss files down to css
      .pipe($.rubySass(sassOptions)).on('error', options.errorHandler('RubySass'))
      .pipe(cssFilter)
      // Add the css --> scss source maps to bottom of css files
      .pipe($.sourcemaps.init({ loadMaps: true }))
      // Add browser vendor specific css rule prefixes automatically.
      // TODO mcritch: Configure to support our target browsers.
      .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
      .pipe($.sourcemaps.write())
      .pipe(cssFilter.restore())
      // Write the css files to the staging directory and reload the app.
      .pipe(gulp.dest(options.tmp + '/serve/app/'))
      .pipe(browserSync.reload({ stream: true }));
   });
};
