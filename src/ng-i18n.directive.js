angular.module('ng-i18n.directive', [])

.directive('ngI18n', function($parse, $filter, I18N) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      key: '@'
    },
    link: function(scope, element, attrs) {
      var key = I18N.get(attrs.key),
        value,
        token,
        tokens,
        tokenVal,
        $scope = scope.$parent;
      scope.$watch(replace);

      function replace() {
        value = key;
        tokens = value.match(/\{[^\}]+?\}/g);
        while (tokens) {
          token = tokens[0].substring(1, tokens[0].length - 1);
          if (token.match(/[\|]/g)) {
            token = trim(token.split('|')[0]);
            tokenVal = $filter(trim(token[1]))($parse(attrs[token])($scope));
          } else {
            tokenVal = $parse(attrs[token])($scope);
          }
          value = value.replace(new RegExp(makeRegExpSafe(tokens[0]), 'g'), tokenVal || '');
        }
        element.html(value);
      }

      function makeRegExpSafe(str) {
        return str.replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\|/g, '\\|');
      }

      function trim(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
  };
});
