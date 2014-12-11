//Test Skitty Main Module Methods
//Note: It is unecessary to test for each command as, if the functions work as
//      well as the skitty-resources package then the commands work inherently
//
// type .testSkittyInfoMod() in chat to test

//variables
var config = SkittyConfig.load(),
    modules = [
        //test Skitty Module
        skitty_info = new SkittyInfo()
    ],
    //run skitty-plugapi
    skitty = SkittyPlugApi.run(config, modules),
    counter = 0;

function testSkittyMod() {
    Tinytest.addAsync('Skitty Info Package - Methods', function(test, done) {
        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [];

            //only register callback on specific input message
            if (data.message == '.testSkittyInfoMod()') {
                //test on each skitty method
                var theme = skitty_info.showTheme();
                //testing ermify inherently tests .translate
                // var erm = skitty_info.ermify(data);

                console.log(theme)
                //run tests
                // test.isNotNull(insult);
                // test.throws(insult);
                // test.isNotNull(erm);
                // test.throws(erm);

                callbacks.push(data);
            }

            counter++;

            //wait on return msgs from bot before closing
            //@todo Figure out a better way to have the test continue to run
            //allowing user to test various chat commands until the final
            //.testSkittyCurmMod() command which will finish test and close api
            if (counter >= 3) {
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
