//Test SkittyCore Class

//@todo get contents from file
//ensure file can't be read from client
//@todo gather credentials from a file
api = SkittyPlugApi.api({
    'email': "email",
    'password': "password"
}, {
    'attempts': 5,
    'delay': 1000,
    'room': 'room-name'
});

//Get Core methods
core = new SkittyCore(api);

function testSkittyCorePerm() {
    Tinytest.addAsync('SkittyCore', function(test, done) {

        var msg = "TEST METHODS - hasPermission() - showMessage() - checkCommands()";

        var counter = 0;

        var testCommand = 'testSkittyCore()';

        var chatCommand = [{
            trigger: testCommand,
            action: core.bop.bind(this, true)
        }];

        api.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [];

            //only register callback on specific input message
            // console.log(data.raw.uid);
            if (data.message == '.' + testCommand) {
                var permission = core.hasPermission(data.raw.id);
                var show_msg = core.showMessage(msg);
                var cmds = core.checkCommands.bind(core, chatCommand);
                // var bop = core.bop(true);

                //run tests
                test.isNotNull(permission);
                test.equal(permission, true || false, 'hasPermission - test');
                test.isTrue(show_msg);
                test.throws(cmds);

                callbacks.push(data);
            }

            counter++;

            //run .testSM() command once
            if (callbacks.length === 1 && counter === 1) {
                done();
            }
        }));

        //can only be tested when song changes
        api.on('advance', Meteor.bindEnvironment(function(data) {
            var song = core.songChange(data);

            //returns a document
            test.ok(song);

            done();
        }));

    });
}

//Test joinRoom()
function testJoinRoom() {
    Tinytest.add('SkittyCore - joinRoom', function(test) {
        var room = api.on('roomJoin', core.joinRoom);

        test.isNotNull(room);
        test.ok(room);
    });
}

//Server Side
if (Meteor.isServer) {
    testJoinRoom();
    testSkittyCorePerm();
}


/**
 * Attempt to play around with testAsyncMulti method for tinytest
 * doesn't seem to be implemented or working; not sure why
 */

// testAsyncMulti("SkittyCore - check", [
//     function(test, expect) {
//         var check_core = function(core, event, method) {

//             var callback = function(error, result) {
//                 test.isFalse(error);

//                 if (!error) {
//                     //test permissions
//                     test.isNotNull(result);
//                     test.isTrue(result);
//                 }
//             };

//             api.on(event, method, expect(callback));

//             // if( Meteor.isServer ){
//             //     try{
//             //         var result =
//             //     } catch (e) {
//             //         callback(e, e.response);
//             //     }
//             // }
//         };

//         check_core(core, 'chat', function(data) {
//             console.log( data );
//             // if( data ){

//             // }
//         });
//     }
// ])
