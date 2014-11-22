/* Test connect method */
Tinytest.add('SkittyPlugApi.connect()', function(test) {
    //@todo gather credentials from a file
    var api = SkittyPlugApi.connect({
        'email': "testbot@eran.sh",
        'password': "test2test2"
    }, {
        'attempts': 5,
        'delay': 1000,
        'room': 'coding-soundtrack-lounge'
    });

    var attempts = SkittyPlugApi.isFirstConnect();

    test.throws(api);
    test.isNotNull(api);
    //test attempts
    test.isNotNull(attempts);
    test.isTrue(attempts);
});
