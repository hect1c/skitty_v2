Package.describe({
    name: 'skitty-resources',
    summary: 'Static Files',
    version: '1.0.0',
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.1');
    api.use('stevezhu:lodash');
    api.addFiles(
        [
            'public/gifs.json',
            'public/info.json',
            'public/quotes.json',
            'public/curmudgeon.json',
            'public/facts.json',
            'public/funny_responses.json',
        ], 'server', {
            isAsset: true
        });
    api.addFiles('skitty-resources.js');
    api.export('SkittyResource');
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('skitty-resources');
    api.addFiles('skitty-resources-tests.js');
});
