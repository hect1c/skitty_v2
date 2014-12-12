/* Test run method */
Tinytest.add('SkittyPlugApi.run()', function(test) {

    //@todo get credentials from file (ensure file is in gitignore)
    var config = SkittyConfig.load();
    var modules = [];

    //run method
    var skitty = SkittyPlugApi.run(config,modules);

    test.ok(skitty);
    //check loads plugapi
    test.isNotNull(skitty.plugapi);
    test.throws(skitty.plugapi);
    //check loads skitty-core methods
    test.isNotNull(skitty.core);
    test.throws(skitty.core);
});
