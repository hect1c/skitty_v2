(function () {
  // plugins should be initialized before passing them into the plug bot
  //   the api will be passed via the init function

  function StatTracker (model, api) {
    var self = this,
        api = {},
        chatCommands = [
          { trigger: 'statchaton', action: toggleStatChat.bind(this, true) },
          { trigger: 'statChatOn', action: toggleStatChat.bind(this, true) },
          { trigger: 'statchatoff', action: toggleStatChat.bind(this, false) },
          { trigger: 'statChatOff', action: toggleStatChat.bind(this, false) }
        ],
        announcePlayStats = model.announcePlayStats || false,
        currentSong = {};

    // <helpers>
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
          var message;

          // if a collection is passed the selection is randomized
          if( Object.prototype.toString.call( model.resources.affirmativeResponses ) === '[object Array]' ) {
            var i = Math.round(Math.random()*(model.resources.affirmativeResponses.length-1));
            message = model.resources.affirmativeResponses[i];
          }
          
          console.log(onoff);
          announcePlayStats = onoff;
          api.sendChat(message);
        }
      }

      function logSongPlay (song) {
        if (announcePlayStats && song.startTime) {
          var woots = song.woots.length || 0,
              mehs  = song.mehs.length || 0,
              grabs = song.grabs.length || 0;

          api.sendChat(model.resources.stats.songPlay.replace('{woots}', woots).replace('{mehs}', mehs).replace('{grabs}', grabs));
        }
      }
    // </helpers>

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

        currentSong = data.media;

        // append stat props
        currentSong.startTime = data.mediaStartTime;
        currentSong.woots = [];
        currentSong.mehs = [];
        currentSong.grabs = [];
      }

      function joinRoom (data) {
        botAcctInfo = api.getSelf();
        currentSong = data.room.media;
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