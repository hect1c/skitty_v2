/* Test connect method */
Tinytest.add('SkittyPlugApi.connect()', function(test) {
    //@todo gather credentials from a file
    var api = SkittyPlugApi.connect({
        'email': "email",
        'password': "password"
    }, {
        'attempts': 5,
        'delay': 1000,
        'room': 'room-name'
    });

    var attempts = SkittyPlugApi.isFirstConnect();

    test.throws(api);
    test.isNotNull(api);
    //test attempts
    test.isNotNull(attempts);
    test.isTrue(attempts);
});
