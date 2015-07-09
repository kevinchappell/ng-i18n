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
