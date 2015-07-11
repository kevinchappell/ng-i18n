/*
ng-i18n - git@github.com:kevinchappell/ng-i18n.git
Version: 1.1.1
Author: Kevin Chappell <kevin.b.chappell@gmail.com>
*/
angular.module('ngI18n', [])
  .provider('I18N', function() {
    'use strict';

    var config = {
      langsDir: 'lang/',
      default: {
        locale: 'en-us',
        name: 'English'
      },
      langs: [{
        locale: 'en-us',
        name: 'English'
      }, {
        locale: 'pt-pt',
        name: 'Portuguese'
      }]
    };

    /**
     * extend the default config object to change language
     * list and language file location to be used in module.config(...)
     * @param  {object} configObj user defined config object
     * @return {object}
     */
    this.config = function(configObj) {
      return angular.extend(config, configObj);
    };

    /**
     * Angular function for instantiating our Provider
     */
    this.$get = ['$rootScope', '$http', function i18nService($rootScope, $http) {
      return new I18N($rootScope, $http);
    }];

    function I18N($rootScope, $http) {
      var i18n = this,
        langs = {},
        current = $rootScope.lang || sessionStorage.getItem('locale') || 'en-us',
        localeKey = '#__locale__#',
        nameKey = '#__name__#',
        utils = {};

      i18n.loaded = [];

      /**
       * Turn raw text from the language files into fancy JSON
       * @param  {String} rawText
       * @return {object}
       */
      utils.fromFile = function(rawText) {
        var lines = rawText.split('\n');
        for (var json = {}, matches, i = 0; i < lines.length; i++) {
          matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/);
          if (matches) {
            json[matches[1]] = matches[2].replace(/^\s+|\s+$/, '');
          }
        }
        return json;
      };

      /**
       * turn the raw text from loadLang() into
       * @param  {string} rawText
       */
      utils.processFile = function(response) {
        var rawText = response.data;
        rawText.replace(/\n\n/g, '\n');
        var json = utils.fromFile(rawText),
          locale = json[localeKey];
        current = locale;
        if (!langs[locale]) {
          langs[locale] = json;
          i18n.loaded.push({
            locale: locale,
            name: json[nameKey]
          });
        }
        $rootScope.lang = locale;
      };

      /**
       * Escape AngularJS filter syntax
       * @param  {string} str special characters
       * @return {string}     escaped special characters
       */
      utils.makeSafe = function(str) {
        var mapObj = {
          '{': '\\{',
          '}': '\\}',
          '|': '\\|'
        };
        return str.replace(/\{|\}|\|/g, function(matched) {
          return mapObj[matched];
        });
      };

      /**
       * return the currently selected language
       * @return {string} current locale
       */
      i18n.getCurrent = function() {
        return current;
      };

      /**
       * return currently available languages
       * @return {object}
       */
      i18n.getLangs = function() {
        return config.langs;
      };

      /**
       * $http.get a language file by locale
       * @param  {string} locale
       * @return {promise}
       */
      i18n.loadLang = function(locale) {
        return $http.get(config.langsDir + locale, {
            cache: true
          })
          .then(utils.processFile)
          .catch(function(error) {
            console.error(error);
            throw error;
          });
      };

      /**
       * get a string from a loaded language file
       * @param  {String} key  - the key for the string we are trying to retrieve
       * @return {String}      - correct language string
       */
      i18n.get = function(key) {
        var string = (langs[current] && langs[current][key]) || (langs['en-us'] && langs['en-us'][key]) || key;
        return string;
      };

      /**
       * Parse arguments for the Directive and Filter
       * @param  {string} key  the key we use to lookup our translation
       * @param  {multi}  args  string, number or object containing our arguments
       * @return {string}      updated string translation
       */
      i18n.parseArgs = function(key, args) {
        var value = i18n.get(key),
          tokens,
          token,
          tokenVal;

        if ('string' !== typeof value) {
          return;
        }
        tokens = value.match(/\{[^\}]+?\}/g);

        if ('object' === typeof args) {
          angular.forEach(tokens, function(val) {
            token = val.substring(1, val.length - 1);
            tokenVal = args[token];
            value = value.replace(new RegExp(utils.makeSafe(val), 'g'), tokenVal || '');
          });
        } else {
          value = value.replace(/\{[^\}]+?\}/g, args);
        }

        return value;
      };

      /**
       * attempt to set the current language to the local provided
       * @param {string}   locale
       * @param {Function} cb     callback to execute after language has been set good for dialogs and such
       */
      i18n.setCurrent = function(locale, cb) {
        var promise = this.loadLang(locale);
        promise.then(function(response) {
          window.sessionStorage.setItem('locale', locale);
          if (typeof cb === 'function') {
            return cb(response);
          }
        }, function(reason) {
          console.error('Failed: ' + reason);
        });
      };

      i18n.setCurrent(current);

      // expose utils for testing
      if ('test' === config.env) {
        i18n.utils = utils;
      }

      return i18n;
    }
  });

angular.module('ngI18n')
  .directive('ngI18n', ['I18N', function(I18N) {
    'use strict';

    return {
      restrict: 'E',
      scope: {
        key: '@'
      },
      link: function(scope, element, attrs) {
        var value;

        function updateString() {
          value = I18N.parseArgs(attrs.key, attrs);
          element.html(value);
        }

        scope.$watch(updateString);
      }
    };
  }]);

angular.module('ngI18n')
  .filter('i18n', ['I18N', function(I18N) {
    'use strict';

    /**
     * Retrieves translation for a given key
     * @param  {String} key     The key to be retrieved
     * @param  {Dynamic} args   variables to be used in the string replacement
     * @return {String}         Translated string
     */
    var i18nFilter = function(key, args) {
      if (!key) {
        return;
      }
      return I18N.parseArgs(key, args);
    };

    i18nFilter.$stateful = true;
    return i18nFilter;
  }]);
