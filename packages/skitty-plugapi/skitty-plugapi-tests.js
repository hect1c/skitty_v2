/* Test run method */
Tinytest.add('SkittyPlugApi.run()', function(test) {

    //@todo implement necessary modules
    //@todo get credentials from file (ensure file is in gitignore)
    //@todo create method which aggregates all names of existing packages to be
    //registerd as modules?
    var config = {
            auth: {
                'email': "email",
                'password': "password"
            },
            con: {
                'attempts': 5,
                'delay': 1000,
                'room': 'room-name'
            }
        },
        modules = [];

    //@todo gather credentials from a file
    var skitty = SkittyPlugApi.run(config,modules);

    test.ok(skitty);
    //check loads plugapi
    test.isNotNull(skitty.plugapi);
    test.throws(skitty.plugapi);
    //check loads skitty-core methods
    test.isNotNull(skitty.core);
    test.throws(skitty.core);
});
