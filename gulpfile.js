'use strict' ;

var gulp    = require('gulp'),
    gzip    = require('gulp-gzip'),
    jshint  = require('gulp-jshint'),
    connect = require('gulp-connect'),
    karma   = require('gulp-karma'),
    ugly    = require('gulp-uglify'),
    concat  = require('gulp-concat');

var srcFiles = [
  'src/ng-i18n.js',
  'src/ng-i18n-provider.js',
  'src/ng-i18n-directive.js',
  'src/ng-i18n-filter.js'
  ];

gulp.task('watch', function(){
  gulp.watch(['src/**/*.js'], ['lint', 'js']);
});

gulp.task('karma', function() {
  gulp.src('test/**/*.js')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('lint', function() {
  return gulp.src(srcFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('js', function () {
  gulp.src(srcFiles)
    .pipe(concat('ng-i18n.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(ugly())
    .pipe(concat('ng-i18n.min.js'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/'));
});

gulp.task('serve', function() {
  connect.server();
});

gulp.task('default', ['js', 'watch', 'serve']);
