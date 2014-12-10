//Test Skitty Settings
Tinytest.add('SkittyConfig', function (test) {
    var config = SkittyConfig.load();

    //Make sure data is being returned
    test.isNotNull(config);
    test.throws(config.con.delay);
    test.throws(config.con.attempts);
    test.throws(config.con.room);
    test.throws(config.auth.email);
    test.throws(config.auth.password);
    test.ok(config);
});
