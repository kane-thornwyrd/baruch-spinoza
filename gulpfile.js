'use strict';

var
  gulp            = require('gulp'),
  cog             = require('gulp-cog'),
  source          = require('vinyl-source-stream'),
  buffer          = require('vinyl-buffer'),
  rename          = require('gulp-rename'),
  uglify          = require('gulp-uglify'),
  sourcemaps      = require('gulp-sourcemaps'),
  gutil           = require('gulp-util'),
  concat          = require('gulp-concat'),
  foreach         = require('gulp-foreach'),
  browserSync     = require('browser-sync'),
  stylus          = require('gulp-stylus'),
  ghPages         = require('gulp-gh-pages'),
  nib             = require('nib'),
  stylusTypeUtils = require('stylus-type-utils'),
  datef           = require('date-format'),
  reload          = browserSync.reload,
  conf            = require('./gulpconf.json')
;


conf.js.uglify.cleanConf.preserveComments = function(node, comment){
  return /@\w+/.test(comment.value);
};


gulp.task('show-conf', function() {
  console.log(conf);
});

gulp.task('default', function() {
});

gulp.task('js', function() {
  // Include all files you want cog to know about in the pipeline
  gulp.src(conf.js.src)
    // Select the files cog should look for includes in.
    // This will also filter the stream to match the glob provided
    .pipe(cog(conf.js.masterName))
    // Loop over the filtered files
    .pipe(foreach(function(stream, masterFile) {
      return stream
        .pipe(cog.includes())
        .pipe(concat(masterFile.relative))
      ;
    }))
    .pipe(uglify(conf.js.uglify.cleanConf))
    .on('error', gutil.log)
    .pipe(gulp.dest(conf.js.dest))
    .pipe(sourcemaps.init(conf.js.sourcemaps.conf))
    .pipe(uglify(conf.js.uglify.minConf))
    .on('error', gutil.log)
    .pipe(rename({ extname: conf.js.minExt }))
    .pipe(gulp.dest(conf.js.dest))
    .pipe(sourcemaps.write(conf.js.sourcemaps.dest))
    .pipe(gulp.dest(conf.js.dest))
    .pipe(reload({ stream:true }))
  ;

});

gulp.task('stylus', function(){
  conf.stylus.options.fullCompression.use = [nib()];

  gulp.src(conf.stylus.src)
    .pipe(stylus(conf.stylus.options.fullCompression))
    .on('error', gutil.log)
    .pipe(gulp.dest(conf.stylus.dest))
    .on('error', gutil.log)
    .pipe(reload({ stream:true }))
  ;
});


gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
      message: ":construction_worker: Update " + datef(new Date()) + "."
    }));
});

gulp.task('watch', function() {

  browserSync({
    server: {
      baseDir: conf.root
    }
  });
  gulp
    .watch(conf.js.src, ['js']);
  gulp
    .watch(conf.stylus.src, ['stylus'])
  ;

});
