require('es6-shim');

if (!global.Intl) {
  global.Intl = require('intl');
  require('intl/locale-data/jsonp/en.js');
}
