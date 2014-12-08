Package.describe({
  name: 'skitty-core',
  summary: 'Core Methods for Skitty',
  version: '1.0.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('stevezhu:lodash');
  api.export("SkittyCore");
  api.addFiles('skitty-core.js');
});

Package.onTest(function(api) {
  api.use(['stevezhu:lodash','skitty-plugapi','tinytest']);
  api.addFiles(['skitty-core.js','skitty-core-tests.js']);
});