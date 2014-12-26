angular.module('ng-i18n.filter', [])

.filter('i18n', function(I18N) {
  'use strict';

  /**
   * Retrieves translation for a given key
   * @param  {String} key     The key to be retrieved
   * @param  {Dynamic} args   variables to be used in the string replacement
   * @return {String}         Translated string
   */
  return function(key, args) {
    if (!key) {
      return;
    }
    //TODO:
    // `args` should be able to be dynamic
    key = I18N.get(key).replace(/\{[^\}]+?\}/g, args);
    return key;
  };
})

;
