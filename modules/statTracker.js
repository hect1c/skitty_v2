(function () {
  // local dependencies
  var moment = require("moment"),
      q = require("q");

  // tracking and reporting plugin for songs, artists and djs
  function StatTracker (model) {
    var self = this,
        api = {},
        core = {},
        announcePlayStats = model.announcePlayStats || false,
        announceSongPlay = model.announceSongPlay || true,
        currentSong = {};

    // <stat reports>
      // stat summary for a song. also used for room stats
      function statSummary (plays, firstPlayed) {
        var ups = 0,
            downs = 0,
            hearts = 0,
            peakListeners = 0,
            firstPlay = null,
            message,
            botPlays = 0;

        if (plays) {
          for (var i in plays) {
            if (plays[i].woots && !isInBlacklist(plays[i].djId)) {
              ups = ups + plays[i].woots.length;
              downs = downs + plays[i].mehs.length;
              hearts = hearts + plays[i].grabs.length;

              if (plays[i].users.length > peakListeners) {
                peakListeners = plays[i].users.length;
              }

              if (!firstPlay || plays[i].startTime < firstPlay) {
                firstPlay = plays[i];
              }

            } else if (isInBlacklist(plays[i].djId)) {
              botPlays++;
            }
          }

          message = model.resources.stats.statSummary.replace('{plays}', plays.length - botPlays)
                                            .replace('{ups}', ups)
                                            .replace('{downs}', downs)
                                            .replace('{hearts}', hearts)
                                            .replace('{peakListeners}', peakListeners);
        } else {
          message = model.resources.stats.four04;
        }

        core.showMessage(message);

        if (firstPlayed) {
          var timefrom = moment().from(firstPlay.startTime, true);
          var dj = findDjName(firstPlay);
          core.showMessage(model.resources.stats.firstPlayed.replace('{dj}', dj).replace('{time}', timefrom));
        }
      }

      // play stats for the song that just ended
      function playStats (song) {
        if (announcePlayStats) {
          var woots = song.woots.length || 0,
              mehs  = song.mehs.length || 0,
              grabs = song.grabs.length || 0,
              listeners = song.peakListeners || 0;

          core.showMessage(model.resources.stats.songPlay.replace('{woots}', woots).replace('{mehs}', mehs).replace('{grabs}', grabs));
        }
      }

      function djSummary (plays) {
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

          message = model.resources.stats.djStats.replace('{plays}', plays.length)
                                                  .replace('{ups}', ups)
                                                  .replace('{downs}', downs)
                                                  .replace('{hearts}', hearts)
                                                  .replace('{avgUps}', avgUps);
        } else {
          message = model.resources.stats.four04dj;
        }

        core.showMessage(message);
      }

      // play start with last played info
      function playStart (data) {
        if (currentSong.startTime && announceSongPlay) {
          model.stats.qFindFirstLastPlayById(currentSong.id, -1).then(function (lastplay) {
            var message = model.resources.stats.songStart.base.replace('{title}', currentSong.title).replace('{artist}', currentSong.author);

            // for(var i in data.media.users) {
            var currentDjName = api.getDJ().username;
              // if ( api.getDJ() ) {
            message = message.replace('{dj}', currentDjName);
                // break;
              // }
            // }

            if (lastplay) {
              var timefrom = moment().from(lastplay.startTime, true);
              message = message + model.resources.stats.songStart.lastPlayed.replace('{time}', timefrom);
            } else {
              message = message + model.resources.stats.songStart.newPlay;
            }

            core.showMessage(message);
          }, genericErrorHandler);
        }
      }
    // </stat reports>

    // <helpers>
      function isInBlacklist(userId) {
        if (model.djBlacklist) {
          for (var i in model.djBlacklist) {
            if (model.djBlacklist[i] === userId) {
              return true;
            }
          }
        }

        return false;
      }

      function findDjName (play) {
        for (var i in play.users) {
          if (play.users[i].id === play.djId) {
            return play.users[i].username;
          }
        }
      }

      function getTimeStamp () {
        var now = new Date();
        return now.toLocaleDateString() + " - "  + now.toLocaleTimeString();
      }

      function genericErrorHandler (err) {
        console.log(err);
        core.showMessage(model.resources.generic.genericError);
      }

      function toggleStatChat (onoff, data) {
        if (core.hasPermission(data.fromID)) {
          core.showMessage(model.resources.generic.affirmativeResponse);
          announcePlayStats = onoff;
        } else {
          core.showMessage(model.resources.generic.accessDeniedResponse);
        }
      }

      function toggleSongMessage (onoff, data) {
        if (core.hasPermission(data.fromID)) {
          core.showMessage(model.resources.generic.affirmativeResponse);
          announceSongPlay = onoff;
        } else {
          core.showMessage(model.resources.generic.accessDeniedResponse);
        }
      }

      function djStats (data) {
        model.stats.qGetDjPlaysById(data.fromID).then(djSummary, genericErrorHandler);
      }

      function skittyStats () {
        model.stats.qGetDjPlaysById(core.botInfo.id).then(djSummary, genericErrorHandler);
      }

      function songStats () {
        var id;

        // if we're not tracking current song, get the id from the API
        if (currentSong.id) {
          id = currentSong.id;
        } else {
          id = api.getMedia().id;
        }

        model.stats.qGetAllBySongsById(id).then(function (plays) { statSummary(plays, true); }, genericErrorHandler);
      }

      // get artist stats. either by name or for current playing
      function artistStats (data) {
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

        model.stats.qGetAllByArtistName(artistName).then(statSummary, genericErrorHandler);
      }

      function roomStats () {
        model.stats.qGetAllPlays().then(statSummary, genericErrorHandler);
      }
    // </helpers>

    // <subscription methods>
      function voteUpdate (data) {
        var clearFrom;

        if (currentSong.startTime) {
          if (data.vote === 1) {
            currentSong.woots.push(data.id);
            clearFrom = currentSong.mehs;
          } else {
            currentSong.mehs.push(data.id);
            clearFrom = currentSong.woots;
          }

          // if user changes vote we need to cancel previous vote
          var check = clearFrom.indexOf(data.id);
          if (check > -1) {
            clearFrom.splice(check, 1);
          }
        }
      }

      function grabUpdate (data) {
        if (currentSong.startTime) {
          currentSong.grabs.push(data.id);
        }
      }

      function songChange (data) {
        if (currentSong.startTime) {
          model.stats.logSongPlay(currentSong);
          playStats(currentSong);
        }

        // reset song data
        if (data.media) {
          currentSong = data.media;

          // append stat props
          currentSong.djId = data.currentDJ;
          currentSong.earned = data.earned;
          currentSong.startTime = Date.now();
          currentSong.users = api.getUsers();
          currentSong.woots = [];
          currentSong.mehs = [];
          currentSong.grabs = [];
        } else {
          currentSong = {};
        }

        playStart(data);
      }
    // </subscription methods>

    var chatCommands = [
      { trigger: 'statchaton',  action: toggleStatChat.bind(this, true) },
      { trigger: 'statchatoff', action: toggleStatChat.bind(this, false) },
      { trigger: 'songmsgon',   action: toggleSongMessage.bind(this, true) },
      { trigger: 'songmsgoff',  action: toggleSongMessage.bind(this, false) },
      { trigger: 'roomstats',   action: roomStats},
      { trigger: 'songstats',   action: songStats},
      { trigger: 'artiststats', action: artistStats},
      { trigger: 'skittystats', action: skittyStats},
      { trigger: 'mystats',     action: djStats}
    ];

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      if (core.isFirstConnect()) {
        api.on('chat', core.checkCommands.bind(core, chatCommands));
        api.on('djAdvance', songChange);
        api.on('voteUpdate', voteUpdate);
        api.on('curateUpdate', grabUpdate);
      }
    };
  }

  exports.StatTracker = StatTracker;
}());