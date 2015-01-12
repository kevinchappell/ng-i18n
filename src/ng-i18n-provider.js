ngI18n.provider('I18N', function() {
  var config = {
    langsDir: 'lang/',
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
   * @param  {Object} configObj user defined config object
   * @return {Object}
   */
  this.config = function(configObj) {
    angular.extend(config, configObj);
    return ['$rootScope', '$http', '$q', function i18nService($rootScope, $http, $q) {
      return new I18N($rootScope, $http, $q).loadLang(config.langs[0].locale);
    }];
  };

  this.$get = ['$rootScope', '$http', '$q', function i18nService($rootScope, $http, $q) {
    return new I18N($rootScope, $http, $q);
  }];

  function I18N($rootScope, $http, $q) {
    var current = $rootScope.lang || 'en-us',
      langs = {},
      localeKey = '#__locale__#',
      nameKey = '#__name__#',
      utils = {},
      i18n = this;
    i18n.loaded = [];

    /**
     * Turn raw text from the language files into fancy JSON
     * @param  {String} rawText
     * @return {Object}
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
     * Write to our language file
     * TODO - finished
     * @param  {String} translationMap
     * @return {String}
     */
    utils.toFile = function(translationMap) {
      var raw = [];
      for (var line in translationMap) {
        if (translationMap.hasOwnProperty(line)) {
          raw.push(line + ' = ' + translationMap[line]);
        }
      }
      return raw.join('\n');
    };

    /**
     * get a string from a loaded language file
     * @param  {String} key  - the key for the string we are trying to retrieve
     * @return {String}      - correct lanuage string
     */
    i18n.get = function(key) {
      var string = (langs[current] && langs[current][key]) || (langs['en-us'] && langs['en-us'][key]) || key;
      return string;
    };

    i18n.getCurrent = function() {
      return current;
    };

    i18n.getLangs = function() {
      return config.langs;
    };

    i18n.loadLang = function(locale) {
      function onLoad(rawText) {
        rawText.replace(/\n\n/g, '\n');
        var json = utils.fromFile(rawText),
          locale = json[localeKey];
        langs[locale] = json;
        i18n.loaded.push({
          locale: locale,
          name: json[nameKey]
        });
        current = locale;
        $rootScope.lang = locale;
      }
      var deferred = $q.defer();

      $http.get(config.langsDir + locale).success(function(response) {
        if (response && !isNaN(response.errorCode)) {
          deferred.reject(response);
        } else {
          deferred.resolve(response);
          onLoad(response);
        }
      });
      return deferred.promise;
    };

    i18n.setCurrent = function(locale, cb) {
      var promise = this.loadLang(locale),
        deferred = $q.defer();
      promise.then(function(response) {
        deferred.resolve(response);
        // console.log(response);
        if (typeof cb === 'function') {
          return cb();
        }
      }, function(reason) {
        deferred.reject(reason);
        console.error('Failed: ' + reason);
      });
      return deferred.promise;
    };

    i18n.loadLang(current);
    return i18n;
  }
});
