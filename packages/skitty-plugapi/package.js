'use strickt';

Package.describe({
    name: 'skitty-plugapi',
    summary: "Plug.dj API",
    version: "1.0.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  //variables to be used in other packages
  api.export('SkittyPlugApi');

  api.addFiles('skitty-plugapi.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.addFiles('skitty-plugapi.js');
  api.add_files('skitty-plugapi-tests.js');
});

Npm.depends({
    "plugapi": "https://github.com/plugCubed/plugAPI/archive/8b12f898bd2762b3a208b7af2385fb91f93c1ea4.tar.gz"
});