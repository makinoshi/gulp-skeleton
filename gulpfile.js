var gulp = require('gulp'), 
    browserify = require('browserify'), 
    source = require('vinyl-source-stream'), 
    buffer = require('vinyl-buffer'), 
    reactify = require('reactify'),
    plumber = require('gulp-plumber'), 
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'), 
    sass = require('gulp-ruby-sass');

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
  gulp.src('./css/*.css')
      .pipe(connect.reload());
});

// compile react .jsx files
gulp.task('react', function(){
  browserify({
    entries: ['./src/main.js'],
    transform: [reactify]
  }).bundle()
      .pipe(source('app.js'))
      .pipe(plumber)
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'));
});

// compile scss files
gulp.task('scss', function() {
  gulp.src('scss/**/*.scss')
      .pipe(plumber)
      .pipe(scss({
        style: 'expanded'       //other: nested, compact, compressed
        // , compass: true
      }))
      .pipe(gulp.dest('./dist/css/'));
});

// file watch task
gulp.task('watch', function() {
  gulp.watch(['./*html'], ['html']);
  gulp.watch(['./css/*.css'], ['css']);
  gulp.watch(['./src/*.js', './src/*.jsx'], ['react']);
  gulp.watch(['scss/**/*.scss'], ['scss']);
});

gulp.task('default',
          ['server', 'scss', 'react', 'watch']);
