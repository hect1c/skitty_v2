Package.describe({
  name: 'skitty-killswitch',
  summary: 'Maintain killSwitch for Skitty',
  version: '1.0.0',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.1');
  api.use('skitty-resources');
  api.export('SkittyKillSwitch');
  api.addFiles('skitty-killswitch.js');
});

Package.onTest(function(api) {
  api.use([
        'tinytest',
        'skitty-killswitch',
        'skitty-config',
        'skitty-plugapi'
    ]);
  api.addFiles('skitty-killswitch-tests.js');
});
