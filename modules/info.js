(function () {
  // plugin that provides information about the room, djs and songs playing
  function InfoPlugin (model) {
    var self = this,
        api = {},
        core = {};

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
      var chatCommands = [
        { trigger: 'cmds',       action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'commands',   action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'help',       action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'help',       action: showMessage.bind(this, model.resources.commands) },
        { trigger: 'plugapi',    action: showMessage.bind(this, model.resources.plugapi) },
        { trigger: 'src',        action: showMessage.bind(this, model.resources.src) },
        { trigger: 'theme',      action: showTheme }
      ];
    // </chat commands>

    // <subscription methods>
      function showMessage (message, data) {
        core.showMessage(message, data);
      }
    // </subscription methods>

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      // subscriptions
      api.on('roomJoin', function (data) {
        botAcctInfo = api.getSelf();
        currentSong = data.room.media;
      });
      api.on('chat', core.checkCommands.bind(core, chatCommands));
    };
  }

  exports.InfoPlugin = InfoPlugin;
}());