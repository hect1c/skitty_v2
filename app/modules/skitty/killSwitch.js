'use strict';

  // Allows the bot application to be exited from chat using a two-step process.
  //   Useful in case a bug causes a chat loop or something silly like that ;)
  function KillSwitch (model) {
    var self = this,
        api = {},
        core = {},
        killStagedBy = null;

    function stageKill (data) {
      if (core.hasPermission(data.fromID) && !killStagedBy) {
        killStagedBy = data.fromID;
        core.showMessage(model.resources.confirm);

        // TODO: make auto-unstage configurable via model
        setTimeout(function () {
          killStagedBy = null;
        }, model.timeout || 5000);
      }
    }

    function terminate (data) {
      // only the person who staged the kill can execute it
      if (core.hasPermission(data.fromID) && data.fromID === killStagedBy) {
        core.showMessage(model.resources.logoff);

        setTimeout(function() {
          console.log(' exited by user: ' + killStagedBy);
          process.exit();
        });
      }
    }

    function cancel (data) {
      // only the person who staged the kill can cancel it
      if (core.hasPermission(data.fromID) && data.fromID === killStagedBy) {
        core.showMessage(model.resources.cancel);
        killStagedBy = null;
      }
    }

    var chatCommands = [
          { trigger: 'exit', action: stageKill },
          { trigger: 'yes',  action: terminate },
          { trigger: 'no',   action: cancel }
      ];

    // add subscriptions and init code here
    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;
      if (core.isFirstConnect()) {
        // subscriptions
        api.on('chat', core.checkCommands.bind(core, chatCommands));
      }
    };
  }

  exports.KillSwitch = KillSwitch;
