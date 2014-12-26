describe('Localization Provider: I18N', function() {
	'use strict';

	var httpBackend,
		i18nProvider,
		I18N;

	beforeEach(function() {
		// create a dummy module to configure our provider
		angular.module('testApp', ['ngI18n'])
			.config(function(I18NProvider) {
				I18NProvider.config({
					env: 'test'
				});
				i18nProvider = I18NProvider;
			});

		module('testApp', 'ngI18n');
		inject(function($httpBackend, _I18N_) {
			httpBackend = $httpBackend;
			I18N = _I18N_;
		});
	});

	// test .config()
	it('tests the providers internal function', function() {
		var i18nConfig = i18nProvider.config();
		expect(i18nConfig.default.locale).toBe('en-us');
	});

	// test .getLangs()
	it('should get the list of available languages', function() {
		var list = [{
			locale: 'en-us',
			name: 'English'
		}, {
			locale: 'pt-pt',
			name: 'Portuguese'
		}];
		expect(I18N.getLangs()).toEqual(list);
	});

	// test .fromFile()
	it('should convert the language file to JSON', function() {
		var us = '#__locale__# = en-us\n' +
			'#__name__# = English\n' +
			'helloworld = Hello World!';

		var response = typeof I18N.utils.fromFile(us);
		expect(response).toEqual('object');
	});

	// test .get() method
	it('should get the translated string', function() {
		var us = 'helloworld = Hello World!';

		httpBackend.expectGET('lang/en-us').respond(us);
		httpBackend.flush();

		var response = I18N.get('helloworld');

		expect(response).toBe('Hello World!');
	});

	describe('parseArgs', function() {
		beforeEach(function() {
			spyOn(I18N, 'get').and.returnValue('AngularJS {adjective}');
		});

		it("should call I18N.get", function() {
			I18N.parseArgs('key');
			expect(I18N.get).toHaveBeenCalledWith('key');
		});

		it("should substitute token", function() {
			var value = I18N.parseArgs('key', 'Rocks!');
			expect(value).toBe('AngularJS Rocks!');
		});

	});

});
