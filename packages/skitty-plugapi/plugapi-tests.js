/* Test connect method */
Tinytest.add('SkittyPlugApi.connect()', function(test) {
    var connection = SkittyPlugApi.connect({
        'email': "auth-email",
        'password': "auth-password"
    }, {
        'attempts': 5,
        'delay': 1000,
        'room': 'room-name'
    });

    test.isNotNull(connection);
    test.isUndefined(connection);
});
