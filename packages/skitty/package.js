Package.describe({
  name: 'skitty',
  summary: 'Main Skitty Component',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.export('Skitty');
  api.addFiles('skitty.js');
});

Package.onTest(function(api) {
  api.use(['tinytest','skitty-config','skitty-plugapi','skitty']);
  api.addFiles('skitty-tests.js');
});
