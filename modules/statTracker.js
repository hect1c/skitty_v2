(function () {
  // local dependencies
  var moment = require("moment"),
      mongojs = require("mongojs"),
      q = require("q");

  // tracking and reporting plugin for songs, artists and djs
  function StatTracker (model, api) {
    var self = this,
        api = {},
        chatCommands = [
          { trigger: 'statchaton',  action: toggleStatChat.bind(this, true) },
          { trigger: 'statChatOn',  action: toggleStatChat.bind(this, true) },
          { trigger: 'statchatoff', action: toggleStatChat.bind(this, false) },
          { trigger: 'statChatOff', action: toggleStatChat.bind(this, false) },
          { trigger: 'roomstats',   action: function () { qGetAllPlays().then(statSummary, genericErrorHandler); }}
        ],
        announcePlayStats = model.announcePlayStats || false,
        currentSong = {},
        botAcctInfo = {};

    // <helpers>
      function getTimeStamp () {
        var now = new Date();
        return now.toLocaleDateString() + " - "  + now.toLocaleTimeString();
      }

      function showMessage (msg) {
        var message = msg;

        // if a collection is passed the selection is randomized
        if( Object.prototype.toString.call( msg ) === '[object Array]' ) {
          var i = Math.round(Math.random()*(msg.length-1));
          message = msg[i];
        }

        api.sendChat(message);
      }

      function genericErrorHandler (err) {
        showMessage("er, shit got fucked up. error logged.");
      }
    
      // checks user against all staff
      function hasPermission (userId) {
        var staff = api.getStaff(),
            admins = api.getAdmins(),
            mods = staff.concat(admins);

        for (var i in mods) {
          if (mods[i].id === userId) {
            return true;
          }
        }

        return false;
      }

      function toggleStatChat (onoff, data) {                
        if (hasPermission(data.fromID)) {
          showMessage(model.resources.generic.affirmativeResponse);
          announcePlayStats = onoff;
        } else {
          showMessage(model.resources.generic.accessDeniedResponse); 
        }
      }

      function logSongPlay (song) {
        if (song.startTime) {
          model.db.songPlays.save(song, function (err, saved) {
            if (err || !saved) {
              console.log("Song save failed: " + err);
            }
            // else {
            //   console.log("Saved song play - "  + getTimeStamp());
            // }
          });

          if (announcePlayStats && song.startTime) {
            var woots = song.woots.length || 0,
                mehs  = song.mehs.length || 0,
                grabs = song.grabs.length || 0;
  
            showMessage(model.resources.stats.songPlay.replace('{woots}', woots).replace('{mehs}', mehs).replace('{grabs}', grabs));
          }  
        }
      }
    // </helpers>

    // <model.db queries>
      function qGetAllPlays () {
        var dfr = q.defer(),
            dataHandler = function(err, plays) {
              if (err || !plays) {
                dfr.reject(err);
              } else { 
                if (plays.length > 0) {     
                  dfr.resolve(plays);
                } else {
                  dfr.resolve(null);
                }             
              }  
              
              
            };
        
        model.db.songPlays.find(dataHandler);
        
        return dfr.promise;
      }
      
      function qGetAllBySongName (songName) {
       var dfr = q.defer(),
          dataHandler = function(err, plays) {
            if (err || !plays) {
              dfr.reject(err);
            } else { 
              if (plays.length > 0) {     
                dfr.resolve(plays);
              } else {
                dfr.resolve(null);
              }             
            }  
            
            
          };
        
        model.db.songPlays.find({ songName: songName }, dataHandler);
        
        return dfr.promise;
      }
      
      function qGetAllByArtistName (artistName) {
       var dfr = q.defer(),
          dataHandler = function(err, plays) {
            if (err || !plays) {
              dfr.reject(err);
            } else { 
              if (plays.length > 0) {     
                dfr.resolve(plays);
              } else {
                dfr.resolve(null);
              }             
            }            
          };
        
        model.db.songPlays.find({ artistName: artistName }, dataHandler);
        
        return dfr.promise;
      }
    // </model.db queries>

    // <stat reports>
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
        
        message = model.resources.stats.roomStats.replace('{plays}', plays.length)
                                          .replace('{ups}', ups)
                                          .replace('{downs}', downs)
                                          .replace('{hearts}', hearts)
                                          .replace('{peakListeners}', peakListeners);

        showMessage(message);       
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
        logSongPlay(currentSong);

        if (data.media) {
          currentSong = data.media;

          // append stat props
          currentSong.djId = data.currentDJ;
          currentSong.earned = data.earned;
          currentSong.startTime = data.mediaStartTime;
          currentSong.users = api.getUsers();
          currentSong.woots = [];
          currentSong.mehs = [];
          currentSong.grabs = [];
        } else {
          currentSong = {};
        }
      }

      function joinRoom (data) {
        botAcctInfo = api.getSelf();
      }

      function checkCommands (data) {
        // don't evaluate messages sent by self
        if (botAcctInfo.id !== data.fromID) {
          var msg = data.message.trim();

          for (var i = 0; i < chatCommands.length; i++) {
            // wildcard check
            if (chatCommands[i].wildCard && msg.match(chatCommands[i].trigger)) {
              chatCommands[i].action(data);
              return;
            }

            // command check
            if (( msg.indexOf('.') === 0 ||
                  msg.indexOf('!') === 0 ||
                  msg.indexOf('?') === 0) &&
                  msg.indexOf(chatCommands[i].trigger) === 1) {
              chatCommands[i].action(data);
              return;
            }
          }
        }
      }
    // </subscription methods>

    self.init = function (plugApi) {
      api = plugApi;

      api.on('chat', checkCommands);
      api.on('djAdvance', songChange);    
      api.on('voteUpdate', voteUpdate);
      api.on('currateUpdate', grabUpdate);
      api.on('roomJoin', joinRoom);
    };
  }

  exports.StatTracker = StatTracker;
}());