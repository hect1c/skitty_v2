Package.describe({
  name: 'skitty-core',
  summary: 'Core Methods for Skitty',
  version: '1.0.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('skitty-plugapi');
  api.use('stevezhu:lodash');

  api.export('SkittyCore');
  api.imply('skitty-plugapi');

  api.addFiles('skitty-core.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('skitty-core');
  api.use('stevezhu:lodash');

  api.addFiles('skitty-core.js');
  api.addFiles('skitty-core-tests.js');
});

Npm.depends({
    "fibers": "1.0.2"
});