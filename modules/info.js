(function () {
  // plugin that provides information about the room, djs and songs playing
  function InfoPlugin (model) {
    var self = this,
        currentSong = null,
        api = {},
        core = {},
        announceSongPlay = model.announceSongPlay || true;

    function showTheme () {
      var now = new Date(),
          days = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          day = days[ now.getDay() ];

      if (day === 'Friday') {
        api.sendChat(model.resources.theme.funkyFriday);
      } else {
        api.sendChat(model.resources.theme.none);
      }
    }

    function toggleSongMessage (onoff, data) {                
        if (core.hasPermission(data.fromID)) {
          core.showMessage(model.resources.affirmativeResponse);
          announceSongPlay = onoff;
        } else {
          core.showMessage(model.resources.accessDeniedResponse); 
        }
      }

    // <chat commands>
      var chatCommands = [
        { trigger: 'cmds',       action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'commands',   action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'help',       action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'help',       action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'plugapi',    action: showMessage.bind(this, model.resources.plugapi) },
        { trigger: 'src',        action: showMessage.bind(this, model.resources.src) },
        { trigger: 'theme',      action: showTheme },
        { trigger: 'songMsgOn',  action: toggleSongMessage.bind(this, true) },
        { trigger: 'songmsgon',  action: toggleSongMessage.bind(this, true) },
        { trigger: 'songmsgoff', action: toggleSongMessage.bind(this, false) },
        { trigger: 'songmsgoff', action: toggleSongMessage.bind(this, false) },
      ];
    // </chat commands>

    // <subscription methods>
      function showMessage (message, data) {
        core.showMessage(message, data);
      }

      function songChange (data) {
        currentSong = data.media;

        if (currentSong && announceSongPlay) {
          var message = '/me {dj} started playing ' + data.media.title + ' by ' + data.media.author;

          for(var i in data.djs) {
            if (data.djs[i].user.id === data.currentDJ) {
              message = message.replace('{dj}', data.djs[i].user.username);
              api.sendChat(message);
              return;
            }
          }
        } 
      }
    // </subscription methods>

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      // subscriptions
      // subscriptions
      api.on('roomJoin', function (data) {
        botAcctInfo = api.getSelf();
        currentSong = data.room.media;
      });
      api.on('chat', core.checkCommands.bind(core, chatCommands));
      api.on('djAdvance', songChange);
    };
  }

  exports.InfoPlugin = InfoPlugin;
}());