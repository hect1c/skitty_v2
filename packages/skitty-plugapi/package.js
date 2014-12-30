Package.describe({
    name: 'skitty-plugapi',
    summary: "Plug.dj API",
    version: "1.0.0"
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');
    api.use('skitty-core');
    api.export("SkittyPlugApi");
    api.addFiles('skitty-plugapi.js');
});

Package.onTest(function(api) {
    api.use(['skitty-core','skitty-config','tinytest']);
    api.addFiles(['skitty-plugapi-tests.js', "skitty-plugapi.js"], 'server');
});

Npm.depends({
    "plugapi": "3.0.0"
});
