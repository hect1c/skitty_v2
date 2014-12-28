//Test Skitty Main Module Methods
//Note: We don't close the plug api connection allowing other Skitty Package
//      test commands to be run for testing ie. .songstats, .mystats ...
//
// TEST COMMAND = .testSkittyStats()

function testStatsCommands() {
    Tinytest.addAsync('Skitty Stats - commands', function(test, done) {
        var config = SkittyConfig.load(),
            //load modules
            modules = [
                skitty_stats = new SkittyStats
            ],
            //connect db
            db = SkittyDb,
            //run app
            skitty = SkittyPlugApi.run(config, modules);

        skitty.plugapi.on('advance', Meteor.bindEnvironment(function(data) {
            var song = skitty_stats.songChange(data);

            test.isNotNull(song);
            test.ok(song);
        }));

        skitty.plugapi.on('chat', Meteor.bindEnvironment(function(data) {
            callbacks = [],
                counter = 0;

            if (data.message == '.testSkittyStats()') {

                //following methods do not return any data
                //they just display data to the client
                skitty_stats.artistStats(data);
                skitty_stats.djStats(data);
                skitty_stats.roomStats(data);

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
    testStatsCommands();
}
