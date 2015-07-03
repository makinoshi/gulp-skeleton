'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reactify = require('reactify'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass');

// local server
gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
});

// html task
gulp.task('html', function() {
  gulp.src('./*.html')
      .pipe(browserSync.reload());
});

// css task
gulp.task('css', function() {
  gulp.src('./css/**/*.css')
      .pipe(browserSync.reload());
});

// js task
gulp.task('js', function() {
  gulp.src('./dist/**/*.js')
      .pipe(browserSync.reload());
});

// compile react .jsx files
gulp.task('react', function(){
  browserify({
    entries: ['./js/main.jsx'],
    transform: [reactify]
  }).bundle()
      .on("error", function (err) { console.log("Error : " + err.message); })
      .pipe(source('main.js'))
      .pipe(plumber())
      .pipe(buffer())
      // .pipe(uglify())
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
  gulp.watch(['./*.html'], ['html']);
  gulp.watch(['./css/**/*.css'], ['css']);
  gulp.watch(['./dist/**/*.js'], ['js']);
  gulp.watch(['./scss/**/*.scss'], ['sass']);
  gulp.watch(['./js/*.js', './js/*.jsx'], ['react']);
});

gulp.task('default', ['server', 'sass', 'react', 'watch']);
