(function () {
  // Allows the bot application to be exited from chat using a two-step process. 
  //   Useful in case a bug causes a chat loop or something silly like that ;)
  function KillSwitch (model) {
    var self = this,
        api = {},
        botAcctInfo = {},
        chatCommands = [
          { trigger: 'exit', action: stageKill },
          { trigger: 'yes',  action: terminate },
          { trigger: 'no',   action: cancel }
        ],
        killStagedBy = null;

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

    function stageKill (data) {
      if (hasPermission(data.fromID) && !killStagedBy) {
        killStagedBy = data.fromID;
        api.sendChat("Are you sure you want me to go? (.yes/.no)");

        // TODO: make auto-unstage configurable via model
        setTimeout(function () {
          killStagedBy = null;
        }, model.timeout || 5000);
      }
    }

    function terminate (data) {
      // only the person who staged the kill can execute it
      if (hasPermission(data.fromID) && data.fromID === killStagedBy) {
        api.sendChat("bye bye.");

        setTimeout(function() {
          console.log("exited by user: " + killStagedBy);
          process.exit();
        });
      }
    }

    function cancel (data) {
      // only the person who staged the kill can cancel it
      if (hasPermission(data.fromID) && data.fromID === killStagedBy) {
        api.sendChat("yay! I get to stay :)");
        killStagedBy = null;
      }
    }

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

      function joinRoom (data) {
        botAcctInfo = api.getSelf();
      }
    // </subscription methods>

    // add subscriptions and init code here
    self.init = function (plugApi) {
      api = plugApi;

      api.on('roomJoin', joinRoom);
      api.on('chat', checkCommands);
    };
  }

  exports.KillSwitch = KillSwitch;
}());