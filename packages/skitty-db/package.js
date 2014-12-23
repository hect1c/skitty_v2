Package.describe({
    name: 'skitty-db',
    summary: 'MongoDB Manager',
    version: '1.0.0'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.1');
    api.use([
        'mongo',
        'aldeed:simple-schema',
        'aldeed:collection2',
        'mrt:q'
    ]);
    api.export('SkittyDb');
    api.addFiles([
        'skitty-db.js',
        'lib/songs.js'
    ]);
});

Package.onTest(function(api) {
    api.use([
        'tinytest',
        'skitty-config',
        'skitty-plugapi',
        'skitty-db'
    ]);
    api.addFiles('skitty-db-tests.js');
});
