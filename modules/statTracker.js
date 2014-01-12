(function () {
  // local dependencies
  var moment = require("moment"),
      mongojs = require("mongojs"),
      q = require("q");

  // tracking and reporting plugin for songs, artists and djs
  function StatTracker (model, api) {
    var self = this,
        api = {},
        core = {},
        chatCommands = [
          { trigger: 'statchaton',  action: toggleStatChat.bind(this, true) },
          { trigger: 'statChatOn',  action: toggleStatChat.bind(this, true) },
          { trigger: 'statchatoff', action: toggleStatChat.bind(this, false) },
          { trigger: 'statChatOff', action: toggleStatChat.bind(this, false) },
          { trigger: 'roomstats',   action: function () { qGetAllPlays().then(statSummary, genericErrorHandler); }}
        ],
        announcePlayStats = model.announcePlayStats || false,
        currentSong = {};

    // <helpers>
      function getTimeStamp () {
        var now = new Date();
        return now.toLocaleDateString() + " - "  + now.toLocaleTimeString();
      }

      function genericErrorHandler (err) {
        core.showMessage("er, shit got fucked up. error logged.");
      }
    
      function toggleStatChat (onoff, data) {                
        if (core.hasPermission(data.fromID)) {
          core.showMessage(model.resources.generic.affirmativeResponse);
          announcePlayStats = onoff;
        } else {
          core.showMessage(model.resources.generic.accessDeniedResponse); 
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

          if (announcePlayStats) {
            var woots = song.woots.length || 0,
                mehs  = song.mehs.length || 0,
                grabs = song.grabs.length || 0;
  
            core.showMessage(model.resources.stats.songPlay.replace('{woots}', woots).replace('{mehs}', mehs).replace('{grabs}', grabs));
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

        core.showMessage(message);       
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