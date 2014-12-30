// plugin for managing the bot's playlist
SkittyDj = function(model) {
    model = SkittyResource.call('dj');
    autoDj = true;
    autoDjThreshold = 0;

    var self = this,
        api = {},
        core = {},
        currentSong = null,
        snagReqCount = 0,
        inTheBooth = false,
        djs = [],
        playingTrack = false,
        botAccountInfo = {},
        leaveAfter = false;

    /**
     * Helper Methods
     */

    self.findPlaylistId = function(playlistName, playlists) {
        for (var i in playlists) {
            if (playlists[i].name === playlistName) {
                return playlists[i].id;
            }
        }

        return false;
    }

    // auto Dj Check: bot will enter/leave booth based on provided model settigs
    self.djCheck = function() {
        if (autoDj && !playingTrack) {
            if (!inTheBooth && djs.length <= autoDjThreshold) {
                api.joinBooth();
                core.showMessage(model.autoDj.activate);
                inTheBooth = true;
            } else if (inTheBooth && djs.length > autoDjThreshold + 1) {
                api.leaveBooth();
                core.showMessage(model.autoDj.deactivate);
                inTheBooth = false;
            }
        }
    }

    /**
     * End of Help methods
     */

    self.djUpdate = function(data) {
        djs = data.djs || [];
        self.djCheck();
    }

    /**
     * Grabs songs and adds to bots playlist
     * @param  {Object} data Callback
     * @return {[type]}      [description]
     * @todo Function does not currently work
     *       (Must be fixed in plugapi)
     */
    self.snag = function(data) {
        if (currentSong.media) {
            var playlistId,
                songId = currentSong.media.id,
                allowed = core.hasPermission(data.from.id);
            if (allowed && snagReqCount === 0) {
                api.getPlaylists(function(playlists) {
                    playlistId = findPlaylistId(model.defaultPlaylist, playlists);
                    if (playlistId && songId) {
                        // This REST command seems to fail in PlugAPI so the song isn't added and the callback never fires
                        api.addSongToPlaylist(playlistId, songId, function() {
                            core.showMessage(model.currateMessage);
                        });
                    }
                });
            }
        } else {
            core.showMessage(model.cantCurrate);
        }

        snagReqCount++;
    }

    /**
     * Subscription methods
     */

    /**
     * AutoDj [not sure what this does]
     * @param  {Object} data Callback
     * @return {[type]}      [description]
     * @todo    Figure out what this function
     *          is suppose to do and implement it
     */
    self.autoDj = function(data) {
        if (core.hasPermission(data.from.id)) {
            if (autoDj) {
                core.showMessage(SkittyResource.call('info', 'redundantRequestResponse'));
            } else {
                autoDj = true;

                self.djCheck();

                // if we're going to begin djing immediately we'll rely on the "activate" message instead
                if (djs.length > autoDjThreshold) {
                    core.showMessage(SkittyResource.call('info', 'affirmativeResponse'));
                }
            }
        } else {
            core.showMessage(SkittyResource.call('info', 'accessDeniedResponse'));
        }
    }

    self.toggleDj = function(onff, data) {
        var wasAutoDj = autoDj;
        autoDj = false;

        if (core.hasPermission(data.from.id)) {
            if (onff !== inTheBooth || wasAutoDj) {
                if (onff) {
                    api.joinBooth();

                    if (wasAutoDj) {
                        core.showMessage(SkittyResource.call('info', 'affirmativeResponse'));
                    } else {
                        core.showMessage(model.activate);
                    }
                    inTheBooth = true;
                } else {
                    if (!playingTrack) {
                        api.leaveBooth();
                        inTheBooth = false;
                    } else {
                        leaveAfter = true;
                    }

                    core.showMessage(model.deactivate);
                }
            } else {
                core.showMessage(SkittyResource.call('info', 'redundantRequestResponse'));
            }
        } else {
            core.showMessage(SkittyResource.call('info', 'accessDeniedResponse'));
        }

        return inTheBooth;
    }

    self.skip = function(data) {
        if (currentSong) {
            if (core.hasPermission(data.from.id)) {
                //delete moderator who issued command
                self.deleteMsg(data);
                //allow msg to be deleted before skipping user
                setTimeout(function() {
                    api.moderateForceSkip();
                }, 100);
            } else {
                core.showMessage(SkittyResource.call('info', 'accessDeniedResponse'));
            }
        } else {
            core.showMessage(model.notPlaying);
        }
    }

    //Deletes a chat msg
    self.deleteMsg = function(data) {
        //Before deleting send a chat message from skitty
        core.showMessage(data.raw.un + ' used skip!');
        api.moderateDeleteChat(data.raw.cid);
    }

    self.songChange = function(data) {
        // console.lgo(data);
        currentSong = data;
        snagReqCount = 0;

        // if we are the first dj we are playing
        djs = api.getDJs();
        if (djs.length > 0) {
            playingTrack = botAccountInfo.id === djs[0].id;
        } else {
            playingTrack = false;
        }

        if (leaveAfter && inTheBooth) {
            api.leaveBooth();
            leaveAfter = false;
            inTheBooth = false;
        } else {
            self.djCheck();
        }

        return playingTrack;
    }

    self.roomJoin = function(data) {
        currentSong = {
            media: api.getMedia()
        };
        botAccountInfo = api.getSelf();

        djs = api.getDJs();
        if (djs.length > 0) {
            playingTrack = botAccountInfo.id === djs[0].id;
        } else {
            playingTrack = false;
            self.djCheck();
        }
    }

    // </subscription methods>

    // <chat commands>
    var chatCommands = [{
        trigger: 'snag',
        action: self.snag
    }, {
        trigger: 'nomnom',
        action: self.snag
    }, {
        trigger: 'yoink',
        action: self.snag
    }, {
        trigger: 'currate',
        action: self.snag
    }, {
        trigger: 'skip',
        action: self.skip
    }, {
        trigger: 'skerp',
        action: self.skip
    }, {
        trigger: 'next',
        action: self.skip
    }, {
        trigger: 'gtfo',
        action: self.skip
    }, {
        trigger: 'djOn',
        action: self.toggleDj.bind(this, true)
    }, {
        trigger: 'djon',
        action: self.toggleDj.bind(this, true)
    }, {
        trigger: 'djOff',
        action: self.toggleDj.bind(this, false)
    }, {
        trigger: 'djoff',
        action: self.toggleDj.bind(this, false)
    }, {
        trigger: 'autoDj',
        action: self.autoDj
    }, {
        trigger: 'autodj',
        action: self.autoDj
    }, {
        trigger: 'gogoskittyflow',
        action: self.autoDj
    }];
    // </chat commands>

    self.init = function(plugApi, pluginCore) {
        api = plugApi;
        core = pluginCore;

        if (core.isFirstConnect()) {
            // subscriptions
            api.on('chat', Meteor.bindEnvironment( core.checkCommands.bind(core, chatCommands)));
            api.on('advance', self.songChange);
            api.on('djUpdate', self.djUpdate);
            api.on('roomJoin', self.roomJoin);
        }

    };
}
