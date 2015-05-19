'use strict';

var gutil = require('gulp-util');

var GulpConfig = (function () {
   function GulpConfig() {
      this.src = 'src';
      this.dist = 'dist';
      this.tmp = '.tmp';
      this.e2e = 'e2e';
      // Returns a function intended to be called by a Node Stream.
      this.errorHandler = function (title) {
         return function (err) {
            gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
            // All Streams are instances of Node EventEmmitter.
            // The 'end' event indicates no more data to read from the stream.
            this.emit('end');
         };
      };
      // Config for the wiredep module used in gulp/inject.js
      this.wiredep = {
         directory: 'bower_components'
      }
   }
   return GulpConfig;
})();
module.exports = GulpConfig;
