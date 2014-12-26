angular.module('ng-i18n.service', [])

.service('I18N', function($rootScope, $http, $q) {
  'use strict';

  var current = $rootScope.lang || 'en-us',
    list = [{
      locale: 'en-us',
      name: 'English'
    }, {
      locale: 'pt-pt',
      name: 'Portuguese'
    }], // var list should eventually come from server as list of available languages
    loaded = [],
    langs = {},
    localeKey = '#__locale__#',
    nameKey = '#__name__#',
    i18n = this;

  // keeping private because of future ability to write to file
  var utils = {
    fromFile: function(rawText) {
      var lines = rawText.split('\n');
      for (var json = {}, matches, i = 0; i < lines.length; i++) {
        if (matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/)) {
          json[matches[1]] = matches[2].replace(/^\s+|\s+$/, '');
        }
      }
      return json;
    },
    toFile: function(translationMap) {
      var raw = [];
      for (var each in translationMap) {
        raw.push(each + ' = ' + translationMap[each]);
      }
      return raw.join('\n');
    }
  };

  i18n.get = function(key) {
    return (langs[current] && langs[current][key]) || (langs['en-us'] && langs['en-us'][key]) || key;
  };

  i18n.getCurrent = function() {
    return current;
  };

  i18n.getLangs = function() {
    return list;
  };

  i18n.loadLang = function(lang) {
    function onLoad(rawText) {
      rawText.replace(/\n\n/g, '\n');
      var json = utils.fromFile(rawText),
        locale = json[localeKey];
      langs[locale] = json;
      loaded.push({
        locale: json[locale],
        name: json[nameKey]
      });
    }
    var deferred = $q.defer();
    // TODO add configurable path for languages
    $http.get('/lang/' + lang).success(function(response) {
      if (response && !isNaN(response.errorCode)) {
        deferred.reject(response);
      } else {
        deferred.resolve(response);
        onLoad(response);
        current = lang;
        $rootScope.lang = lang;
      }
    });
    return deferred.promise;
  };

  i18n.setCurrent = function(lang) {
    var promise = this.loadLang(lang);
    promise.then(function() {
      // call a dialog, toast or trigger some other form of confirmation that the language has been changed.
      // Eg:
      var successMsg = i18n.get('settings.language.changeSuccess').replace(/\{(.+?)\}/g, i18n.get(nameKey));
      alert(successMsg);
    }, function(reason) {
      console.error('Failed: ' + reason);
    });
  };

  i18n.loadLang(current);

})

;
