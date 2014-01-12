(function () {

  // set of core functions that can be leveraged by the plugins
  function PlugCore (api) {
    var self = this,
        botAcctInfo;

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

    self.showMessage = function (msg, data) {
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
    };

    self.checkCommands = function (chatCommands, data) {
      if (!botAcctInfo) {
        botAcctInfo = api.getSelf();
      }
      
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
    };
  }

  exports.PlugCore = PlugCore;
}());