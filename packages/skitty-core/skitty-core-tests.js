//Test SkittyCore Methods

//@todo get contents from file
//ensure file can't be read from client
//@todo gather credentials from a file
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

var skitty = SkittyPlugApi.run(config, modules);

function testSkittyCoreMethods() {
    Tinytest.addAsync('SkittyCore - Methods', function(test, done) {

        //setup variables
        var msg = "Test Method - showMessage()",
            counter = 0,
            testCommand = 'testSkittyCore()',
            chatCommand = [{
                trigger: testCommand,
                action: skitty.core.showMessage.bind(this, null, true),
            }];

        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [];

            counter++;

            //only register callback on specific input message
            if (data.message == '.' + testCommand) {
                var permission = skitty.core.hasPermission(data.raw.id);
                var show_msg = skitty.core.showMessage(msg);
                var cmds = skitty.core.checkCommands.bind(skitty.core, chatCommand);
                var first = skitty.core.isFirstConnect();

                //run tests
                test.isNotNull(permission);
                test.equal(permission, true || false, 'hasPermission - test');
                test.isTrue(show_msg);
                test.throws(cmds);
                test.ok(cmds);
                test.isTrue(first);

                callbacks.push(data);
            }


            //listen for command just once
            if (counter > 1) {
                skitty.plugapi.close(); //close api connection
                done(); //finish test run
            }
        }));
    });
}

//Server Side
if (Meteor.isServer) {
    testSkittyCoreMethods();
}
