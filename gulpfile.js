var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var concat = require('gulp-concat');
var pug = require('gulp-pug');


gulp.task('default', ['serve'])
gulp.task('serve', ['less', 'ngcWysiwug:components'], function () {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      //open: true,
      defaultFile: './index.html'
    }));
});



gulp.task('less', ['build:less', 'watch:less'])

gulp.task('watch:less', function () {
  gulp.watch('./app/*/*.less', ['less']);
});

gulp.task('build:less', function () {
  return gulp.src('./app/*/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/public/'));
});

gulp.task('ngcWysiwug:components', ['ngcWysiwug:components:js', 'ngcWysiwug:components:html', 'ngcWysiwug:components:watch'])



gulp.task('ngcWysiwug:components:watch', function () {
  gulp.watch('./app/ngcWysiwug/components/*/*.js', ['ngcWysiwug:components:js']);
  gulp.watch('./app/ngcWysiwug/components/*/*.pug', ['ngcWysiwug:components:html']);
});

gulp.task('ngcWysiwug:components:js', function () {
  return gulp.src('./app/ngcWysiwug/components/*/*.js')
    .pipe(concat('ngcWysiwug-components.js'))
    .pipe(gulp.dest('./app/public/'));
});

gulp.task('ngcWysiwug:components:html', function () {
  return gulp.src('./app/ngcWysiwug/components/*/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./app/public/'));
});
