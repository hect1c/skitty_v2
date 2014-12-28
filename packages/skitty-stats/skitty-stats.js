SkittyStats = function() {
    var self = this,
        api = {},
        core = {},
        currentSong = {},
        announcePlayStats = false,
        announceSongPlay = true,
        songs = SkittyDb.Songs,
        resources = SkittyResource.call('stats');

    /**
     * Statiscal summary of plays
     * @param  {Object} plays       Songs
     * @param  {Boolean} firstPlayed If this first time track has been played
     * @return {String}             Message to be sent to user
     */
    self.statSummary = function(plays, firstPlayed) {
        var ups = 0,
            downs = 0,
            hearts = 0,
            peakListeners = 0,
            firstPlay = null,
            message,
            botPlays = 0;

        if (plays) {
            for (var i in plays) {
                if (plays[i].woots && !self.isInBlacklist(plays[i].djId)) {
                    ups = ups + plays[i].woots.length;
                    downs = downs + plays[i].mehs.length;
                    hearts = hearts + plays[i].grabs.length;

                    if (plays[i].users.length > peakListeners) {
                        peakListeners = plays[i].users.length;
                    }
                    if (!firstPlay || plays[i].startTime < firstPlay) {
                        firstPlay = plays[i];
                    }
                } else if (self.isInBlacklist(plays[i].djId)) {
                    botPlays++;
                }
            }

            message = resources.statSummary.replace('{plays}', plays.length - botPlays)
                .replace('{ups}', ups)
                .replace('{downs}', downs)
                .replace('{hearts}', hearts)
                .replace('{peakListeners}', peakListeners);
        } else {
            message = resources.four04;
        }

        core.showMessage(message);

        if (firstPlayed) {
            var timefrom = moment().from(firstPlay.startTime, true);
            var dj = self.findDjName(firstPlay);
            core.showMessage(resources.firstPlay.replace('{dj}', dj).replace('{time}', timefrom));
        }

        return message;
    }

    /**
     * Stats Report
     */

    /**
     * Play stats for the song that just ended
     * @param  {Object} song Object of current song playing
     * @return {[type]}      [description]
     */
    self.playStats = function(song) {
        if (announcePlayStats) {
            var woots = song.woots.length || 0,
                mehs = song.mehs.length || 0,
                grabs = song.grabs.length || 0,
                listeners = song.peakListeners || 0;

            core.showMessage(
                resources.songPlay
                .replace('{woots}', woots)
                .replace('{mehs}', mehs)
                .replace('{grabs}', grabs)
            );
        }
    }

    /**
     * Displays summary of dj
     * @param  {Object} plays
     * @return {String}       Message to be displayed to user
     */
    self.djSummary = function(plays) {
        var ups = 0,
            downs = 0,
            hearts = 0,
            avgUps = 0,
            message;

        if (plays) {
            for (var i in plays) {
                if (plays[i].woots) {
                    ups = ups + plays[i].woots.length;
                    downs = downs + plays[i].mehs.length;
                    hearts = hearts + plays[i].grabs.length;
                }
            }
            avgUps = Math.round((ups / plays.length) * 100) / 100;
            message = resources.djStats.replace('{plays}', plays.length)
                .replace('{ups}', ups)
                .replace('{downs}', downs)
                .replace('{hearts}', hearts)
                .replace('{avgUps}', avgUps);
        } else {
            message = resources.four04dj;
        }

        core.showMessage(message);

        return message;
    }

    /**
     * Displays information about the current playing song
     *
     * @param  {Object} data Current song object
     */
    self.playStart = function(data) {
        if (currentSong.startTime && announceSongPlay) {
            var play = songs.skittyDbFindOne({
                id: currentSong.id
            });

            var message = resources.songStart.base.replace('{title}', currentSong.title).replace('{artist}', currentSong.author);

            //Instantiate Dj Username
            var currentDjName = api.getDJ().username; //Use getDJ action
            message = message.replace('{dj}', currentDjName); //Setup Message

            if (play) {
                var timefrom = moment().from(play.startTime, true);
                message = message + resources.songStart.lastPlayed.replace('{time}', timefrom);
            } else {
                message = message + resources.songStart.newPlay;
            }
            core.showMessage(message);
        }

        return play;
    }

    /**
     * end of stats report
     */

    /**
     * Helpers
     */

    self.isInBlacklist = function(userId) {
        //@todo implement this feature
        //     if (model.djBlacklist) {
        //         for (var i in model.djBlacklist) {
        //             if (model.djBlacklist[i] === userId) {
        //                 return true;
        //             }
        //         }
        //     }
        return false;
    }

    self.findDjName = function(play) {
        for (var i in play.users) {
            //make sure same type cast
            if (Number(play.users[i].id) === Number(play.djId)) {
                return play.users[i].username;
            }
        }
    }

    self.getTimeStamp = function() {
        var now = new Date();
        return now.toLocaleDateString() + ' - ' + now.toLocaleTimeString();
    }

    self.genericErrorHandler = function(err) {
        console.log(err);
        core.showMessage(SkittyResource.call('info', 'genericError'));
    }

    self.toggleStatChat = function(onoff, data) {
        if (core.hasPermission(data.from.id)) {
            core.showMessage(SkittyResource.call('info', 'affirmativeResponse'));
            announcePlayStats = onoff;
        } else {
            core.showMessage(SkittyResource.call('info', 'accessDeniedResponse'));
        }
    }

    //skitty-dj
    self.toggleSongMessage = function(onoff, data) {
        if (core.hasPermission(data.from.id)) {
            core.showMessage(SkittyResource.call('info', 'affirmativeResponse'));
            announceSongPlay = onoff;
        } else {
            core.showMessage(SkittyResource.call('info', 'accessDeniedResponse'));
        }
    }

    self.djStats = function(data) {
        songs.getDjPlaysById(data.from.id).then(
            self.djSummary,
            self.genericErrorHandler
        );
    }

    self.skittyStats = function() {
        songs.getDjPlaysById(core.botInfo.id).then(
            self.djSummary,
            self.genericErrorHandler
        );
    }

    /**
     * Aggregates and displays current song statistics
     * @return {[type]} [description]
     */
    self.songStats = function() {
        var id;

        // if we're not tracking current song, get the id from the API
        if (currentSong.id) {
            id = currentSong.id;
        } else {
            id = api.getMedia().id;
        }

        songs.getAllSongsById(id).then(function(plays) {
            self.statSummary(plays, true);
        }, self.genericErrorHandler);
    }

    // get artist stats. either by name or for current playing
    self.artistStats = function(data) {
        var artistName,
            command = data.message.trim();
        if (command.length > 12) {
            artistName = command.substr(12, command.length).trim();
        } else {
            // if we're not tracking current song, get the name from the API
            if (currentSong.author) {
                artistName = currentSong.author;
            } else {
                artistName = api.getMedia().author;
            }
        }
        songs.getAllPlaysByArtistName(artistName).then(self.statSummary, self.genericErrorHandler);
    }

    self.roomStats = function() {
        songs.getAllPlays().then(
            self.statSummary,
            self.genericErrorHandler
        );
    }

    /**
     * End of helper methods
     */

    /**
     * Subscription methods
     */

    /**
     * [voteUpdate description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    self.voteUpdate = function(data) {
        var clearFrom;
        if (currentSong.startTime) {
            if (data.v === 1) {
                currentSong.woots.push(data.i);
                clearFrom = currentSong.mehs;
            } else {
                currentSong.mehs.push(data.i);
                clearFrom = currentSong.woots;
            }
            // if user changes vote we need to cancel previous vote
            var check = clearFrom.indexOf(data.i);
            if (check > -1) {
                clearFrom.splice(check, 1);
            }
        }
    }

    self.grabUpdate = function(data) {
        if (currentSong.startTime) {
            currentSong.grabs.push(data.i);
        }
    }

    self.songChange = function(data) {
        if (currentSong.startTime) {
            songs.logSongPlay(currentSong, function(err, result) {
                if (err) {
                    console.log('Song insert failed: ' + err);
                }
            });

            self.playStats(currentSong);
        }

        // reset song data
        if (data.media) {
            currentSong = data.media;
            // append stat props
            currentSong.djId = data.currentDJ.id;
            currentSong.earned = data.earned;
            currentSong.startTime = new Date();
            currentSong.users = api.getUsers();
            currentSong.woots = [];
            currentSong.mehs = [];
            currentSong.grabs = [];
        } else {
            currentSong = {};
        }

        var play = self.playStart(data);

        return play;
    };

    /**
     * End of subscription methods
     */

    var chatCommands = [{
        trigger: 'statchaton',
        action: self.toggleStatChat.bind(this, true)
    }, {
        trigger: 'statchatoff',
        action: self.toggleStatChat.bind(this, false)
    }, {
        trigger: 'songmsgon',
        action: self.toggleSongMessage.bind(this, true)
    }, {
        trigger: 'songmsgoff',
        action: self.toggleSongMessage.bind(this, false)
    }, {
        trigger: 'roomstats',
        action: self.roomStats
    }, {
        trigger: 'songstats',
        action: self.songStats
    }, {
        trigger: 'artiststats',
        action: self.artistStats
    }, {
        trigger: 'skittystats',
        action: self.skittyStats
    }, {
        trigger: 'mystats',
        action: self.djStats
    }];

    // add subscriptions and init code here
    self.init = function(plugApi, pluginCore) {
        api = plugApi;
        core = pluginCore;

        if (core.isFirstConnect()) {
            api.on('chat', Meteor.bindEnvironment(core.checkCommands.bind(core, chatCommands)));
            api.on('advance', Meteor.bindEnvironment(self.songChange));
            api.on('vote', self.voteUpdate);
            api.on('grab', self.grabUpdate);
        }
    };
}
