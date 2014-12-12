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
    "plugapi": "https://github.com/plugCubed/plugAPI/archive/8b12f898bd2762b3a208b7af2385fb91f93c1ea4.tar.gz"
});
