'use strict';

// Karma configuration
// Generated on Fri Dec 26 2014 15:18:53 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/ng-i18n-provider.js',
      'src/ng-i18n-filter.js',
      'src/ng-i18n-directive.js',
      'test/**/*.spec.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      'src/**/*.js': ['coverage']
    },

    coverageReporter: {
      type: 'lcovonly',
      dir: 'coverage/',
      instrumenterOptions: {
        istanbul: { noCompact: true }
      }
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
