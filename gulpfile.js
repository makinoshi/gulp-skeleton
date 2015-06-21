'use strict';

var gulp = require('gulp'), 
    browserify = require('browserify'), 
    source = require('vinyl-source-stream'), 
    buffer = require('vinyl-buffer'), 
    reactify = require('reactify'),
    plumber = require('gulp-plumber'), 
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass');

// local server
gulp.task('server', function() {
  connect.server({
    root: ['./'],
    port: 8000,
    livereload: true
  });
});

// html task
gulp.task('html', function() {
  gulp.src('./*.html')
      .pipe(connect.reload());
});

// css task
gulp.task('css', function() {
  gulp.src('./css/**/*.css')
      .pipe(connect.reload());
});

// compile react .jsx files
gulp.task('react', function(){
  browserify({
    entries: ['./src/main.js'],
    transform: [reactify]
  }).bundle()
      .pipe(source('app.js'))
      .pipe(plumber())
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'));
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
  gulp.watch(['./css/*.css'], ['css']);
  gulp.watch(['./scss/**/*.scss'], ['sass']);
  // gulp.watch(['./src/*.js', './src/*.jsx'], ['react']);
});

// gulp.task('default', ['server', 'sass', 'react', 'watch']);
gulp.task('default', ['server', 'sass', 'watch']);

