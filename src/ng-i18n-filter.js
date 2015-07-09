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
