describe('Localization service: I18N', function () {
  'use strict';

  var httpBackend,
    I18N,
    mockDialogs;

  mockDialogs = {
    succuess: angular.noop
  };

  beforeEach(module('ng-i18n'));

  beforeEach(inject(function ($httpBackend, _I18N_) {
    httpBackend = $httpBackend;
    I18N = _I18N_;
  }));

  // tests setCurrent(), loadLang() and get()
  it('should get the list of available languages', function () {
    var list = [{
      locale: 'en-us',
      name: 'English'
    }, {
      locale: 'pt-pt',
      name: 'Portuguese'
    }];

    expect(I18N.getLangs()).toEqual(list);
  });


  it('should convert the language file to JSON', function () {
    var us = '#__locale__# = en-us\n' +
      '#__name__# = English\n' +
      'helloworld = Hello World!';

    function fromFile(rawText) {
      var lines = rawText.split('\n');
      for (var json = {}, matches, i = 0; i < lines.length; i++) {
        if (matches = lines[i].match(/^(.+?) *?= *?([^\n]+)/)) {
          json[matches[1]] = matches[2].replace(/^\s+|\s+$/, '');
        }
      }
      return json;
    }

    var response = typeof fromFile(us);
    expect(response).toEqual("object");
  });

  it('should get the translated string', function () {

    var us = '#__locale__# = en-us\n' +
      '#__name__# = English\n' +
      'helloworld = Hello World!';

    httpBackend.expectGET('/lang/en-us').respond(us);
    httpBackend.flush();
    I18N.setCurrent('en-us');

    var response = I18N.get('helloworld');

    expect(response).toBe('Hello World!');
  });

});
