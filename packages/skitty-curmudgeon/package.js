Package.describe({
    name: 'skitty-curmudgeon',
    summary: 'Maintains Skitty\'s Potty Mouth',
    version: '1.0.0'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.1');
    api.use('skitty-resources');
    api.export('SkittyCurmudgeon');
    api.addFiles('skitty-curmudgeon.js');
});

Package.onTest(function(api) {
    api.use([
        'tinytest',
        'skitty-curmudgeon',
        'skitty-config',
        'skitty-plugapi'
    ]);
    api.addFiles('skitty-curmudgeon-tests.js');
});
