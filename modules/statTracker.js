(function () {
  // local dependencies
  var moment = require("moment"),
      q = require("q");

  // tracking and reporting plugin for songs, artists and djs
  function StatTracker (model) {
    var self = this,
        api = {},
        core = {},
        chatCommands = [
          { trigger: 'statchaton',  action: toggleStatChat.bind(this, true) },
          { trigger: 'statChatOn',  action: toggleStatChat.bind(this, true) },
          { trigger: 'statchatoff', action: toggleStatChat.bind(this, false) },
          { trigger: 'statChatOff', action: toggleStatChat.bind(this, false) },
          { trigger: 'songMsgOn',  action: toggleSongMessage.bind(this, true) },
          { trigger: 'songmsgon',  action: toggleSongMessage.bind(this, true) },
          { trigger: 'songmsgoff', action: toggleSongMessage.bind(this, false) },
          { trigger: 'songmsgoff', action: toggleSongMessage.bind(this, false) },
          { trigger: 'roomstats',   action: roomStats}
        ],
        announcePlayStats = model.announcePlayStats || false,
        announceSongPlay = model.announceSongPlay || true,
        currentSong = {};

    // <helpers>
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

      function roomStats () { 
        model.stats.qGetAllPlays().then(statSummary, genericErrorHandler); 
      }
    // </helpers>

    // <stat reports>
      // stat summary for a song. also used for room stats
      function statSummary (plays) {
        var ups = 0, 
            downs = 0, 
            hearts = 0,
            peakListeners = 0,
            message;

        for (var i in plays) {
          if (plays[i].woots) {
            ups = ups + plays[i].woots.length;
            downs = downs + plays[i].mehs.length;
            hearts = hearts + plays[i].grabs.length;
            
            if (plays[i].users.length > peakListeners) {
              peakListeners = plays[i].users.length;
            }            
          }
        }
        
        message = model.resources.stats.statSummary.replace('{plays}', plays.length)
                                          .replace('{ups}', ups)
                                          .replace('{downs}', downs)
                                          .replace('{hearts}', hearts)
                                          .replace('{peakListeners}', peakListeners);

        core.showMessage(message);       
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

      // play start with last played info
      function playStart (data) {
        if (currentSong.startTime && announceSongPlay) {
          model.stats.qFindFirstLastPlayByName(currentSong.title, -1).then(function (lastplay) {
            var message = model.resources.stats.songStart.base.replace('{title}', currentSong.title).replace('{artist}', currentSong.author);

            for(var i in data.djs) {
              if (data.djs[i].user.id === data.currentDJ) {
                message = message.replace('{dj}', data.djs[i].user.username);
                break;
              }
            }

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

    // <subscription methods>
      function voteUpdate (data) {
        var clearFrom;

        if (currentSong.startTime) {
          if (data.vote) {
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

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      api.on('chat', core.checkCommands.bind(core, chatCommands));
      api.on('djAdvance', songChange);    
      api.on('voteUpdate', voteUpdate);
      api.on('curateUpdate', grabUpdate);
    };
  }

  exports.StatTracker = StatTracker;
}());