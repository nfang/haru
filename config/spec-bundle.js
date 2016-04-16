'use strict';

require('core-js');

require('reflect-metadata');
require('zone.js/dist/zone');

var testing = require('angular2/testing');
var browser = require('angular2/platform/testing/browser');

testing.setBaseTestProviders(
  browser.TEST_BROWSER_PLATFORM_PROVIDERS,
  browser.TEST_BROWSER_APPLICATION_PROVIDERS);

Object.assign(global, testing);

var testContext = require.context('../app', true, /\.spec\.ts$/);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(testContext);
