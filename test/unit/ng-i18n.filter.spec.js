describe("i18n Filter", function() {

  beforeEach(module('ngI18n'));

  beforeEach(function() {
    inject(function(_I18N_) {
      I18N = _I18N_;
    });
  });

  it('should return the key when a value is not found in the language file', inject(function($filter) {
    var filtered = $filter('i18n')('nothing');
    expect(filtered).toBe('nothing');
  }));

});
