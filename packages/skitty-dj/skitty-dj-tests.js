//Test Skitty Main Module Methods
//Note: We don't close the plug api connection allowing other Skitty Package
//      test commands to be run for testing ie. .songstats, .mystats ...
//
// TEST COMMAND = .testSkittyDj()

function testSkittyDj() {
    Tinytest.addAsync('Skitty Dj - commands', function(test, done) {
        var config = SkittyConfig.load(),
            //load modules
            modules = [
                skitty_dj = new SkittyDj
            ],
            //connect db
            db = SkittyDb,
            //run app
            skitty = SkittyPlugApi.run(config, modules);

        // skitty.plugapi.on('advance', Meteor.bindEnvironment(function(data) {
        //     var playing = skitty_dj.songChange(data);

            // console.log(playing);
            // var song = skitty_stats.songChange(data);

            // test.isNotNull(song);
            // test.ok(song);
        // }));

        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [],
                counter = 0;

            if (data.message == '.testSkittyDj()') {

                var on = skitty_dj.toggleDj(true, data);
                var off = skitty_dj.toggleDj(false, data);

                console.log(on);
                console.log(off);

                test.isTrue(on);
                test.isFalse(off);

                callbacks.push(data);
                counter++;
            }

            if (counter === 1 && callbacks.length === 1) {
                done();
            }
        }));


    });
}

if (Meteor.isServer) {
    testSkittyDj();
}
