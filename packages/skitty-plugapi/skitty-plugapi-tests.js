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
                'room': 'coding-soundtrack-lounge'
            }
        },
        modules = [];

    //@todo gather credentials from a file
    var api = SkittyPlugApi.run(config,modules);

    test.throws(api);
    test.isNotNull(api);
});
