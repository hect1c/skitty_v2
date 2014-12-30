Package.describe({
  name: 'skitty-dj',
  summary: 'DJ Module',
  version: '1.0.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use('skitty-resources');
  api.export('SkittyDj');
  api.addFiles('skitty-dj.js');
});

Package.onTest(function(api) {
  api.use([
        'tinytest',
        'skitty-config',
        'skitty-plugapi',
        'skitty-db',
        'skitty-dj'
    ]);
  api.addFiles('skitty-dj-tests.js');
});
