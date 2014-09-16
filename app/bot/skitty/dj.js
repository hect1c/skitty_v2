'use strict';

  // plugin for managing the bot's playlist
  function Dj (model) {
    model = model || {};
    model.autoDjThreshold = model.autoDjThreshold || 0;

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

    // <helper methods>
      function findPlaylistId (playlistName, playlists) {
        for (var i in playlists) {
          if (playlists[i].name === playlistName) {
            return playlists[i].id;
          }
        }

        return false;
      }

      // auto Dj Check: bot will enter/leave booth based on provided model settigs
      function djCheck () {
        if (model.autoDj && !playingTrack) {
          if (!inTheBooth && djs.length <= model.autoDjThreshold) {
            api.joinBooth();
            core.showMessage(model.resources.dj.autoDj.activate);
            inTheBooth = true;
          } else if (inTheBooth && djs.length > model.autoDjThreshold +1) {
            api.leaveBooth();
            core.showMessage(model.resources.dj.autoDj.deactivate);
            inTheBooth = false;
          }
        }
      }
    // </helper methods>

    function djUpdate (data) {
      djs = data.djs || [];
      djCheck();
    }

    function snag (data) {
      if (currentSong.media) {
        var playlistId,
            songId = currentSong.media.id,
            allowed = core.hasPermission(data.fromID);

        if (allowed && snagReqCount === 0) {
          api.getPlaylists(function(playlists) {
            playlistId = findPlaylistId(model.defaultPlaylist, playlists);

            if (playlistId && songId) {
              api.addSongToPlaylist(playlistId, songId, function() {
                core.showMessage(model.resources.dj.currateMessage);
              });
            }
          });
        }
      } else {
        core.showMessage(model.resources.dj.cantCurrate);
      }

      snagReqCount++;
    }

    // <subscription methods>
      function autoDj (data) {
        if (core.hasPermission(data.fromID)) {
          if (model.autoDj) {
            core.showMessage(model.resources.generic.redundantRequestResponse);
          } else {
            model.autoDj = true;

            djCheck();

            // if we're going to begin djing immediately we'll rely on the "activate" message instead
            if (djs.length > model.autoDjThreshold) {
              core.showMessage(model.resources.generic.affirmativeResponse);
            }
          }
        } else {
          core.showMessage(model.resources.generic.accessDeniedResponse);
        }
      }

      function toggleDj (onff, data) {
        var wasAutoDj = model.autoDj;
        model.autoDj = false;

        if (core.hasPermission(data.fromID)) {
          if (onff !== inTheBooth || wasAutoDj) {
            if (onff) {
              api.joinBooth();

              if (wasAutoDj) {
                core.showMessage(model.resources.generic.affirmativeResponse);
              } else {
                core.showMessage(model.resources.dj.activate);
              }
              inTheBooth = true;
            } else {
              if (!playingTrack) {
                api.leaveBooth();
                inTheBooth = false;
              } else {
                leaveAfter = true;
              }

              core.showMessage(model.resources.dj.deactivate);
            }
          } else {
            core.showMessage(model.resources.generic.redundantRequestResponse);
          }
        } else {
          core.showMessage(model.resources.generic.accessDeniedResponse);
        }
      }

      function skip (data) {
        if (playingTrack) {
          if (core.hasPermission(data.fromID)) {
            api.skipSong();
          } else {
            core.showMessage(model.resources.generic.accessDeniedResponse);
          }
        } else {
          core.showMessage(model.resources.dj.notPlaying);
        }
      }

      function songChange (data) {
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
          djCheck();
        }
      }

      function roomJoin (data) {
        currentSong = { media: api.getMedia };
        botAccountInfo = api.getSelf();

        djs = api.getDJs();
        if (djs.length > 0) {
          playingTrack = botAccountInfo.id === djs[0].id;
        } else {
          playingTrack = false;
          djCheck();
        }
      }
    // </subscription methods>

    // <chat commands>
      var chatCommands = [
        { trigger: 'snag',    action: snag },
        { trigger: 'nomnom',  action: snag },
        { trigger: 'yoink',   action: snag },
        { trigger: 'currate', action: snag },
        { trigger: 'skip',    action: skip },
        { trigger: 'skerp',   action: skip },
        { trigger: 'next',    action: skip },
        { trigger: 'gtfo',    action: skip },
        { trigger: 'djOn',    action: toggleDj.bind(this, true) },
        { trigger: 'djon',    action: toggleDj.bind(this, true) },
        { trigger: 'djOff',   action: toggleDj.bind(this, false) },
        { trigger: 'djoff',   action: toggleDj.bind(this, false) },
        { trigger: 'autoDj',  action: autoDj },
        { trigger: 'autodj',  action: autoDj },
        { trigger: 'gogoskittyflow', action: autoDj }
      ];
    // </chat commands>

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      if (core.isFirstConnect()) {
        // subscriptions
        api.on('chat', core.checkCommands.bind(core, chatCommands));
        api.on('djAdvance', songChange);
        api.on('djUpdate', djUpdate);
        api.on('roomJoin', roomJoin);
      }

    };
  }

  exports.Dj = Dj;
