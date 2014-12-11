//Test Skitty Main Module Methods
//Note: It is unecessary to test for each command as, if the functions work as
//      well as the skitty-resources package then the commands work inherently
//
// type .testSkittyMod() in chat to test

//variables
var config = SkittyConfig.load(),
    modules = [
        //test Skitty Module
        skitty_mod = new Skitty()
    ],
    //run skitty-plugapi
    skitty = SkittyPlugApi.run(config, modules),
    counter = 0;

function testSkittyMod() {
    Tinytest.addAsync('Skitty Package - Methods', function(test, done) {

        //setup variables

        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [];

            //only register callback on specific input message
            if (data.message == '.testSkittyMod()') {
                //test on each skitty method
                var bop = skitty_mod.bop(true);
                var msg = skitty_mod.showMessage('Test Method - Skitty.showMessage()', true, data);
                var bot = skitty_mod.joinRoom(data);
                var song = skitty_mod.songChange(data);

                //run tests
                test.equal(bop, 1);
                test.isTrue(msg);
                test.throws(bot);
                test.ok(bot);
                test.throws(song);
                test.ok(song);

                callbacks.push(data);
            }

            counter++;

            //wait on return msged before closing
            if (counter > 3) {
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
