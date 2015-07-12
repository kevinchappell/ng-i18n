'use strict';

var gulp = require('gulp'),
  bsync = require('browser-sync'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  ugly = require('gulp-uglify'),
  header = require('gulp-header'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-cssmin'),
  gzip = require('gulp-gzip'),
  pkg = require('./package.json'),
  git = require('gulp-git'),
  bump = require('gulp-bump'),
  filter = require('gulp-filter'),
  tagVersion = require('gulp-tag-version'),
  karma = require('karma').server,
  reload = bsync.reload;

var files = {
  karma: [
    'node_modules/angular/angular.js',
    'node_modules/angular-mocks/angular-mocks.js'
  ],
  test: [
    'test/**/*.spec.js'
  ],
  js: [
    'src/ng-i18n-provider.js',
    'src/ng-i18n-directive.js',
    'src/ng-i18n-filter.js'
  ],
  sass: [
    'demo/assets/sass/demo.scss',
    'bower_components/flag-icon-css/sass/flag-icon.scss'
  ]
};


var banner = [
  '/*',
  '<%= pkg.name %> - <%= pkg.repository.url %>',
  'Version: <%= pkg.version %>',
  'Author: <%= pkg.authors[0] %>',
  '*/',
  ''
].join('\n');

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js', 'demo/assets/demo.js'], ['lint', 'js']);
  gulp.watch('demo/index.html', reload);
  gulp.watch(files.sass, ['css']);
});

gulp.task('css', function() {

  return gulp.src(files.sass)
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: true
    }))
    .pipe(cssmin())
    .pipe(header(banner, {
      pkg: pkg,
      now: new Date()
    }))
    .pipe(gulp.dest('demo/assets'))
    .pipe(reload({
      stream: true
    }));

});

gulp.task('karma', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
  }, done);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('lint', function() {
  return gulp.src(files.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js', function() {
  return gulp.src(files.js)
    .pipe(concat('ng-i18n.js'))
    .pipe(header(banner, {
      pkg: pkg,
      now: new Date()
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(ugly())
    .pipe(header(banner, {
      pkg: pkg,
      now: new Date()
    }))
    .pipe(concat('ng-i18n.min.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(gulp.dest('demo/assets'))
    .pipe(gzip())
    .pipe(gulp.dest('dist/'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('serve', function() {
  bsync.init({
    server: {
      baseDir: './demo'
    }
  });
});


function increment(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json', './bower.json'])
    // bump the version number in those files
    .pipe(bump({
      type: importance
    }))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit('bumps package version'))
    // read only one file to get the version number
    .pipe(filter('package.json'))
    // **tag it in the repository**
    .pipe(tagVersion());
}

gulp.task('patch', function() {
  return increment('patch');
});
gulp.task('feature', function() {
  return increment('minor');
});
gulp.task('release', function() {
  return increment('major');
});



gulp.task('default', ['js', 'watch', 'karma']);
gulp.task('demo', ['js', 'css', 'watch', 'serve']);
