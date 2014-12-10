//Test Skitty Settings
Tinytest.add('SkittyConfig', function (test) {
    var config = SkittyConfig.load();

    //Make sure data is being returned
    test.isNotNull(config);
    test.throws(config);
    test.ok(config);
});
