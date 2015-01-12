'use strict' ;

var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    karma   = require('gulp-karma'),
    ugly   = require('gulp-uglify'),
    concat  = require('gulp-concat');

gulp.task('watch', function(){
  gulp.watch(['src/**/*.js'], ['js']);
});

gulp.task('karma', function() {
  gulp.src('test/**/*.js')
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('js', function () {
  gulp.src([
    'src/ng-i18n.js',
    'src/ng-i18n-provider.js',
    'src/ng-i18n-directive.js',
    'src/ng-i18n-filter.js'
    ])
    .pipe(concat('ng-i18n.js'))
    .pipe(gulp.dest('vendor/ng-i18n/'))
    .pipe(ugly())
    .pipe(concat('ng-i18n.min.js'))
    .pipe(gulp.dest('vendor/ng-i18n/'));
});

gulp.task('serve', function() {
  connect.server();
});

gulp.task('default', ['js', 'watch', 'serve']);
