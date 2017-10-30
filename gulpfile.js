var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var concat = require('gulp-concat');
var pug = require('gulp-pug');
var concatCss = require('gulp-concat-css');

gulp.task('default', ['serve'])
gulp.task('serve', ['less', 'ngcWysiwyg:components'], function () {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      //open: true,
      defaultFile: './index.html'
    }));
});



gulp.task('less', ['build:less', 'watch:less'])

gulp.task('watch:less', function () {
  gulp.watch('./app/ngcWysiwyg/components/*/*.less', ['build:less']);
});

gulp.task('build:less', function () {
  return gulp.src('./app/ngcWysiwyg/components/*/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(concat("ngcWysiwyg-components.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/public/'));
});

gulp.task('ngcWysiwyg:components', ['ngcWysiwyg:components:js', 'ngcWysiwyg:components:html', 'ngcWysiwyg:components:watch'])



gulp.task('ngcWysiwyg:components:watch', function () {
  gulp.watch('./app/ngcWysiwyg/components/*/*.js', ['ngcWysiwyg:components:js']);
  gulp.watch('./app/ngcWysiwyg/components/*/*.pug', ['ngcWysiwyg:components:html']);
});

gulp.task('ngcWysiwyg:components:js', function () {
  return gulp.src('./app/ngcWysiwyg/components/*/*.js')
    .pipe(concat('ngcWysiwyg-components.js'))
    .pipe(gulp.dest('./app/public/'));
});

gulp.task('ngcWysiwyg:components:html', function () {
  return gulp.src('./app/ngcWysiwyg/components/*/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./app/public/'));
});
