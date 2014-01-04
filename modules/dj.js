(function () {
  // plugin for managing the bot's playlist
  function Dj (model) {
    model = model || {};
    model.autoDjThreshold = model.autoDjThreshold || 0; 

    var self = this,
        api = {},
        currentSong = null,
        snagReqCount = 0,
        inTheBooth = false,
        djs = [],
        botAccountInfo = {};

    // <helper methods>
      function showMessage (msg) {
        var message = msg;

        // if a collection is passed the selection is randomized
        if( Object.prototype.toString.call( msg ) === '[object Array]' ) {
          var i = Math.round(Math.random()*(msg.length-1));
          message = msg[i];
        }

        api.sendChat(message);
      }

      function findPlaylistId (playlistName, playlists) {
        for (var i in playlists) {
          if (playlists[i].name === playlistName) {
            return playlists[i].id;    
          }
        }
        
        return false;
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

      // bot will enter/leave booth based on provided model settigs
      function djCheck () {        
        if (model.autoDj) {
          if (!inTheBooth && djs.length <= model.autoDjThreshold) {
            api.joinBooth();
            inTheBooth = true;
          } else if (inTheBooth && djs.length > model.autoDjThreshold + 1) {
            api.leaveBooth();
            inTheBooth = false;
          }          
        }
      }
    // </helper methods>

    function djUpdate (data) {
      djs = djs  || [];
      djCheck();
    }

    function snag (data) {
      if (currentSong.media) {
        var playlistId,
            songId = currentSong.media.id,
            allowed = hasPermission(data.fromID);

        if (allowed && snagReqCount === 0) {
          api.getPlaylists(function(playlists) {
            playlistId = findPlaylistId(model.defaultPlaylist, playlists);

            if (playlistId && songId) {
              api.addSongToPlaylist(playlistId, songId, function() {
                api.sendChat(':cat2::dash::heart:');
              });            
            }          
          });
        }        
      } else {
        api.sendChat('There ain\'t nothing to snag kid!');
      }

      snagReqCount++;
    }

    // <subscription methods>
      function autoDj (data) {
        if (hasPermission(data.fromID)) { 
          if (model.autoDj) {
            showMessage(model.resources.generic.redundantRequestResponse);
          } else {
            model.autoDj = true;   
            djCheck();       
            showMessage(model.resources.dj.autoDj.activate);
          }
        } else {
          showMessage(model.resources.generic.accessDeniedResponse);
        }
      }

      function toggleDj (onff, data) {
        model.autoDj = false;

        if (hasPermission(data.fromID)) {
          if (onff != inTheBooth) {
            if (onff) {
              api.joinBooth();
              showMessage(model.resources.dj.activate);
              inTheBooth = true;
            } else {
              api.leaveBooth();
              showMessage(model.resources.dj.deactivate);
              inTheBooth = false;
            }
          } else {
            showMessage(model.resources.generic.redundantRequestResponse);
          }
        } else {
          showMessage(model.resources.generic.accessDeniedResponse);
        }
      }

      function skip (data) {
        if (hasPermission(data.fromID)) {
          api.skipSong();
        } else {
          showMessage(model.resources.generic.accessDeniedResponse);
        }
      } 

      function checkCommands (data) {
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

      function songChange (data) {
        currentSong = data;
        snagReqCount = 0;
        djs = data.djs || [];
        djCheck();
      }
    // </subscription methods>

    // <chat commands>
      var chatCommands = [
        { trigger: 'snag',    action: snag },
        { trigger: 'nomnom',  action: snag },
        { trigger: 'yoink',   action: snag },
        { trigger: 'currate', action: snag },
        { trigger: 'skip',    action: skip },
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

    self.init = function (plugApi) {
      api = plugApi;

      api.on('chat', checkCommands);
      api.on('djAdvance', songChange);
      api.on('djUpdate', djUpdate);
      api.on('roomJoin', function(data) {
        currentSong = { media: data.room.media };
        botAcctInfo = api.getSelf();
      });

    };
  }

  exports.Dj = Dj;
}());