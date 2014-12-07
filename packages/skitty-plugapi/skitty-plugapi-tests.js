/* Test run method */
Tinytest.add('SkittyPlugApi.run()', function(test) {

    //@todo implement necessary modules
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
