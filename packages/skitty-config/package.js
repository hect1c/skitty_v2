Package.describe({
  name: 'skitty-config',
  summary: 'Skitty Configuration Package',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.addFiles('skitty-config.js');
  api.export('SkittyConfig');
  api.addFiles(['config.json'], 'server', {isAsset: true});
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('skitty-config');
  api.addFiles('skitty-config-tests.js');
  api.addFiles(['config.json'], 'server', {isAsset: true});
});
