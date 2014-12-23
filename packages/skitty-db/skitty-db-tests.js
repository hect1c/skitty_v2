//Test SkittyDb Module Methods
Tinytest.addAsync('Skitty DB Manager', function(test, done) {
    //load app settings
    var config = SkittyConfig.load(),
        modules = [],
        db = SkittyDb,
        skitty = SkittyPlugApi.run(config, modules);

    skitty.plugapi.on('advance', Meteor.bindEnvironment(function(data) {
        var callbacks = [],
            counter = 0;

        if (data.media) {
            currentSong = data.media;
            // append stat props
            currentSong.djId = data.currentDJ.id;
            currentSong.earned = data.earned;
            // currentSong.startTime = Date.now();
            currentSong.startTime = new Date(Math.floor(Date.now() / 1000));
            currentSong.users = skitty.plugapi.getUsers();
            currentSong.woots = [];
            currentSong.mehs = [];
            currentSong.grabs = [];

            callbacks.push(data);
            counter++;
        }

        //run tests

        //test db Object
        test.throws(db);
        test.ok(db);

        //test log song play
        db.Songs.logSongPlay(currentSong, function(err, res) {
            var result;

            if (err) {
                console.log('Song insert failed: ' + err);
                result = false; //insert failed
            } else {
                console.log('Passed:' + res);
                result = true; //pass :P
            }

            //test insert result
            test.isTrue(result);

            if (counter === 1 && callbacks.length === 1) {
                done(); //finish test run
                // close connection to api to stop listening for events
                skitty.plugapi.close();
            }
        });


        //test getAllPlays
        var allPlays = db.Songs.getAllPlays();
        var songPlaysById = db.Songs.getAllSongsById(currentSong.id);
        var djPlays = db.Songs.getDjPlaysById(currentSong.djId);
        var artistName = db.Songs.getAllPlaysByArtistName(currentSong.author);

        test.ok(allPlays);
        test.ok(songPlaysById);
        test.ok(djPlays);
        test.ok(artistName);
    }));
});
