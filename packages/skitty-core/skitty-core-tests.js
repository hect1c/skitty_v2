//Test SkittyCore Methods
//Note: We don't close the plug api connection allowing other Skitty Package
//      test commands to be run for testing ie. .dance, .props
//
// TEST COMMAND = .testSkittyCore()

//setup variables
var config = SkittyConfig.load(),
    modules = [],
    skitty = SkittyPlugApi.run(config, modules),
    msg = "Test Method - SkittyCore.showMessage()",
    counter = 0,
    testCommand = 'testSkittyCore()',
    chatCommand = [{
        trigger: testCommand,
        action: skitty.core.showMessage.bind(this, null, true),
    }];

function testSkittyCoreMethods() {
    Tinytest.addAsync('SkittyCore Package - Methods', function(test, done) {
        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [];

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
                counter++;
            }

            if (counter === 1 && callbacks.length === 1) {
                done(); //finish test run
            }
        }));
    });
}

//Server Side
if (Meteor.isServer) {
    testSkittyCoreMethods();
}
