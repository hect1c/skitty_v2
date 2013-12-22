(function () {
  // plugin for managing the bot's playlist
  function PlaylistManager (model) {
    model = model || {};
    var self = this,
        api = {},
        currentSong = null,
        snagReqCount = 0;

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
      }
    // </subscription methods>

    // <chat commands>
      var chatCommands = [
        { trigger: 'snag',    action: snag },
        { trigger: 'nomnom',  action: snag },
        { trigger: 'yoink',   action: snag },
        { trigger: 'currate', action: snag }
      ];
    // </chat commands>

    self.init = function (plugApi) {
      api = plugApi;

      api.on('chat', checkCommands);
      api.on('djAdvance', songChange);
      api.on('roomJoin', function(data) {
        currentSong = { media: data.room.media };
      });

    };
  }

  exports.PlaylistManager = PlaylistManager;
}());