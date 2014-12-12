//Test Skitty Main Module Methods
//Note: It is unecessary to test for each command as, if the functions work as
//      well as the skitty-resources package then the commands work inherently
//
// type .testSkittyCurmMod() in chat to test

//variables
var config = SkittyConfig.load(),
    modules = [
        //test Skitty Module
        skitty_curm = new SkittyCurmudgeon()
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
            if (data.message == '.testSkittyCurmMod()') {
                //test on each skitty method
                var insult = skitty_curm.generateInsult(data);
                //testing ermify inherently tests .translate
                var erm = skitty_curm.ermify(data);

                //run tests
                test.isNotNull(insult);
                test.throws(insult);
                test.isNotNull(erm);
                test.throws(erm);

                callbacks.push(data);
                counter++;
            }

            //wait on return msgs from bot before closing
            if (counter === 1 && callbacks.length === 1) {
                done(); //finish test run
            }
        }));
    });
}

//Server Side
if (Meteor.isServer) {
    testSkittyMod();
}
