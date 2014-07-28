'use strict';

  // set of core functions that can be leveraged by the bot plugins
  function PlugCore (shell, api) {
    var self = this;

    self.hasPermission = function (userId) {
      var staff = api.getStaff(),
          admins = api.getAdmins(),
          mods = staff.concat(admins);

      for (var i in mods) {
        if (mods[i].id === userId) {
          return true;
        }
      }

      return false;
    };

    self.isFirstConnect = function() {
      return shell.reconnectAttempts === 0;
    };

    self.showMessage = function (msg, data) {
      if (msg) {
        var message = msg;

        // if a collection is passed the selection is randomized
        if( Object.prototype.toString.call( msg ) === '[object Array]' ) {
          var i = Math.round(Math.random()*(msg.length-1));
          message = msg[i];
        }

        // if data is passed check for sender placeholder
        if (data) {
          message = message.replace('{sender}', '@' + data.from);
        }

        api.sendChat(message);
      }
    };

    // checks against array of trigger/action sets and fires trigger if match is found
    //  NOTE: matching is case-insensitive
    self.checkCommands = function (chatCommands, data) {
      if (!self.botInfo) {
        self.botInfo = api.getSelf();
      }

      // don't evaluate messages sent by self
      if (self.botInfo.id !== data.fromID) {
        var msg = data.message.trim().toLowerCase();

        for (var i in chatCommands) {
          // make match check case-insensitive

          // wildcard check
          if (chatCommands[i].wildCard && msg.indexOf(chatCommands[i].trigger.toLowerCase()) !== -1) {
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
    };
  }

  exports.PlugCore = PlugCore;
