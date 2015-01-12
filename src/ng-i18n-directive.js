ngI18n.directive('ngI18n', ['$parse', '$filter', 'I18N', function($parse, $filter, I18N) {

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
        tokenVal;

      scope.$watch(replaceToken);

      function replaceToken() {
        value = key;
        tokens = value.match(/\{[^\}]+?\}/g);
        angular.forEach(tokens, function(val) {
          token = val.substring(1, val.length - 1);
          tokenVal = attrs[token];
          value = value.replace(new RegExp(makeRegExpSafe(val), 'g'), tokenVal || '');
        });
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
}]);
