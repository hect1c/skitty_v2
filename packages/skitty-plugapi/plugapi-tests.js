/* Test connect method */
Tinytest.add('SkittyPlugApi.connect()', function(test) {
    var connection = SkittyPlugApi.connect({
        'email': "testbot@eran.sh",
        'password': "test2test2"
    }, {
        'attempts': 5,
        'delay': 1000,
        'room': 'coding-soundtrack-lounge'
    });

    var attempts = SkittyPlugApi.isFirstConnect();

    test.isTrue( attempts);
    test.isNotNull(connection);
    test.isUndefined(connection);
});
