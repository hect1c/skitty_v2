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

                //run tests
                test.isNotNull(theme);
                test.throws(theme);
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
