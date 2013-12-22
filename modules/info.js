(function () {
  // plugin that provides information about the room, djs and songs playing
  function InfoPlugin (model) {
    var self = this,
        currentSong = null,
        api = {};

    function showMessage (msg, doBop, data) {
      var message = msg;

      // if a collection is passed the selection is randomized
      if( Object.prototype.toString.call( msg ) === '[object Array]' ) {
        var i = Math.round(Math.random()*(msg.length-1));
        message = msg[i];
      }

      message = message.replace('{sender}', '@' + data.from);

      api.sendChat(message);

      if (doBop) {
        bop(false);
      }
    }

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

    // <chat commands>
      // info
      var chatCommands = [
        { trigger: 'cmds',     action: showMessage.bind(this, model.resources.commands, false) },
        { trigger: 'commands', action: showMessage.bind(this, model.resources.commands, false) },
        { trigger: 'help',     action: showMessage.bind(this, model.resources.commands, false) },
        { trigger: 'theme',    action: showTheme }
      ];
    // </chat commands>

    // <subscription methods>
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

      function songChange (data) {
        currentSong = data.media;

        if (currentSong) {
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

    self.init = function (plugApi) {
      api = plugApi;

      // subscriptions
      api.on('roomJoin', function (data) {
        botAcctInfo = api.getSelf();
        currentSong = data.room.media;
      });
      api.on('chat', checkCommands);
      api.on('djAdvance', songChange);
    };
  }

  exports.InfoPlugin = InfoPlugin;
}());