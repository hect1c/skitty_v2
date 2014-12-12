//Test Skitty Main Module Methods
//Note: It is unecessary to test for each command as, if the functions work as
//      well as the skitty-resources package then the commands work inherently
//
// type .testSkittyKillMod() in chat to test

//variables
var config = SkittyConfig.load(),
    modules = [
        //test Skitty Module
        skitty_kill = new SkittyKillSwitch()
    ],
    //run skitty-plugapi
    skitty = SkittyPlugApi.run(config, modules),
    counter = 0;

function testSkittyMod() {
    Tinytest.addAsync('Skitty KillSwitch Package - Methods', function(test, done) {
        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [];

            //only register callback on specific input message
            if (data.message == '.testSkittyKillMod()') {
                //test on each skitty method
                var stage = skitty_kill.stageKill(data);

                //run tests
                test.isNotNull(stage);
                test.throws(stage);

                callbacks.push(data);
            }

            counter++;

            //wait on return msgs from bot before closing
            //Note: Due to the terminate function the test will always
            //reset itself since the process does. Check test page to confirm test
            //before refresh - essentially code never getst to the following part
            if (counter === 4) {
                skitty.plugapi.close(); //close api connection
                done(); //finish test run
            }
        }));
    });
}

//Server Side
if (Meteor.isServer) {
    testSkittyMod();
}
