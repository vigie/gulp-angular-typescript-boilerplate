'use strict';

var gulp = require('gulp');

// All gulp plugins matching the given pattern available on $ object.
var $ = require('gulp-load-plugins')({
   pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function (options) {

   // Task: partials --------------------------------------------------------------------------
   // Minifies all html templates and then creates a javascript file in .tmp/partials that
   // puts all html files into angular's $templateCache
   gulp.task('partials', function () {
      return gulp.src([
         options.src + '/app/**/*.html',
         options.tmp + '/serve/app/**/*.html'
      ])
      .pipe($.minifyHtml({
         empty: true,
         spare: true,
         quotes: true
      }))
      .pipe($.angularTemplatecache('templateCacheHtml.js', {
         module: 'gulpAngularTypescriptBoilerplate',
         root: 'app'
      }))
      .pipe(gulp.dest(options.tmp + '/partials/'));
   });

   // Task: html ------------------------------------------------------------------------
   // Deps: inject, partials
   // * Concatenates and minifies all css and js files found in build blocks in index.html
   //   to new versioned files.
   // * Replaces the references to the original files in index.html to these new,
   //   versioned, minified files.
   // * Minifies index.html itself
   // * Writes all optimized files out to the distribution folder.
   gulp.task('html', ['inject', 'partials'], function () {
      var partialsInjectFile = gulp.src(options.tmp + '/partials/templateCacheHtml.js', { read: false });
      var partialsInjectOptions = {
         starttag: '<!-- inject:partials -->',
         ignorePath: options.tmp + '/partials',
         addRootSlash: false
      };

      var htmlFilter = $.filter('*.html');
      var jsFilter = $.filter('**/*.js');
      var cssFilter = $.filter('**/*.css');
      var assets;

      return gulp.src(options.tmp + '/serve/*.html')
         // Add the template cache file reference to index.html
         .pipe($.inject(partialsInjectFile, partialsInjectOptions))
         // Scans html files for build blocks. Concatenates the files found in each
         // build block and returns those files in a stream for further processing,
         // excluding the original html files.
         .pipe(assets = $.useref.assets())
         // Versions the files in stream by appending a content hash to filename.
         .pipe($.rev())
         .pipe(jsFilter)
         // Minify js
         .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', options.errorHandler('Uglify'))
         .pipe(jsFilter.restore())
         .pipe(cssFilter)
         // Minify css
         .pipe($.csso())
         .pipe(cssFilter.restore())
         // Add back the excluded html files to the stream
         .pipe(assets.restore())
         // Replace the build blocks in the html files with references to the minified,
         // concatenated assets.
         .pipe($.useref())
         // Update those asset references to reflect their versioned file names.
         .pipe($.revReplace())
         .pipe(htmlFilter)
         // Minify the html
         .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
         }))
         .pipe(htmlFilter.restore())
         // Write the optimized files to the distribution folder
         .pipe(gulp.dest(options.dist + '/'))
         .pipe($.size({ title: options.dist + '/', showFiles: true }));
   });

   // Task: fonts------------------------------------------------------------------------
   // Writes all font files to the distribution folder
   // Only applies for fonts from bower dependencies. Custom fonts are handled by the
   // "other" task
   gulp.task('fonts', function () {
      return gulp.src($.mainBowerFiles())
         .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
         .pipe($.flatten())
         .pipe(gulp.dest(options.dist + '/fonts/'));
   });

   // Task: other------------------------------------------------------------------------
   // Writes any remaining non-code files to the distribution folder (images, fonts, etc).
   gulp.task('other', function () {
      return gulp.src([
            options.src + '/**/*',
            '!' + options.src + '/**/*.{html,css,js,scss,ts}'
      ])
         .pipe(gulp.dest(options.dist + '/'));
   });

   // Task: clean------------------------------------------------------------------------
   // Deps: tsd:purge
   // Removes the dist and tmp folders.
   gulp.task('clean', ['tsd:purge'], function (done) {
      $.del([options.dist + '/', options.tmp + '/'], done);
   });

   // Task: build------------------------------------------------------------------------
   // Deps: html, fonts, other
   // Creates all assets in the distribution folder.
   gulp.task('build', ['html', 'fonts', 'other']);
};
