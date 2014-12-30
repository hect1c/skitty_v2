Package.describe({
    name: 'skitty-stats',
    summary: 'Tracking and Reporting module for songs, artists and djs',
    version: '1.0.0'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.1');
    api.use([
        'skitty-resources',
        'skitty-db',
        'mrt:moment'
    ]);
    api.export('SkittyStats');
    api.addFiles('skitty-stats.js');
});

Package.onTest(function(api) {
    api.use([
        'tinytest',
        'skitty-config',
        'skitty-plugapi',
        'skitty-db',
        'skitty-stats'
    ]);
    api.addFiles('skitty-stats-tests.js');
});
