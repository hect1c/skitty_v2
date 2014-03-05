(function () {
  // plugin that provides information about the room, djs and songs playing
  function InfoPlugin (model) {
    var self = this,
        api = {},
        core = {},
        chatCommands = [
          { trigger: 'cmds',       action: showMessage.bind(this, model.resources.commands) },
          { trigger: 'commands',   action: showMessage.bind(this, model.resources.commands) },
          { trigger: 'help',       action: showMessage.bind(this, model.resources.commands) },
          { trigger: 'help',       action: showMessage.bind(this, model.resources.commands) },
          { trigger: 'plugapi',    action: showMessage.bind(this, model.resources.plugapi) },
          { trigger: 'src',        action: showMessage.bind(this, model.resources.src) },
          { trigger: 'rules',      action: showMessage.bind(this, model.resources.rules) },
          { trigger: 'theme',      action: showTheme }
        ];

    function showTheme () {
      var now = new Date(),
          days = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          day = days[ now.getDay() ];

      if (day === 'Friday') {
        core.showMessage(model.resources.theme.funkyFriday);
      } else {
        core.showMessage(model.resources.theme.none);
      }
    }

    function showMessage (message, data) {
      core.showMessage(message, data);
    }

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      if (core.isFirstConnect()) {
        api.on('chat', core.checkCommands.bind(core, chatCommands));
      }
    };
  }

  exports.InfoPlugin = InfoPlugin;
}());