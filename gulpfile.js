'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify'), 
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

// local server
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
});

// reload browser
gulp.task('reload', function() {
  browserSync.reload();
});

// compile react .jsx files
gulp.task('react', function(){
  browserify('./js/main.jsx', { debug: true })
      .transform(babelify)
      .bundle()
      .on("error", function (err) { console.log("Error : " + err.message); })
      .pipe(source('main.js'))
      .pipe(plumber())
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/'));
});

// compile scss files
gulp.task('sass', function() {
  gulp.src('./scss/**/*.scss')
      .pipe(plumber())
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
});

// file watch and run tasks
gulp.task('watch', function() {
  gulp.watch(['./*.html', './css/**/*.css', './dist/**/*.js'], ['reload']);
  // gulp.watch(['./css/**/*.css'], ['Css']);
  gulp.watch(['./scss/**/*.scss'], ['sass']);
  gulp.watch(['./js/*.js', './js/*.jsx'], ['react']);
});

gulp.task('default', ['server', 'sass', 'react', 'watch']);
