Package.describe({
  name: 'skitty-info',
  summary: 'Module for general skitty information',
  version: '1.0.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.use('skitty-resources');
  api.export('SkittyInfo');
  api.addFiles('skitty-info.js');
});

Package.onTest(function(api) {
  api.use([
        'tinytest',
        'skitty-info',
        'skitty-config',
        'skitty-plugapi'
    ]);
  api.addFiles('skitty-info-tests.js');
});
