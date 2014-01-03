(function () {
  // plugins get initialized before being passed to the plug bot
  //   the api will be provided via the init function

  function PluginTemplate (model) {
    var self = this,
        api = {},
        botAccount,
        chatCommands = [
          { trigger: 'woot',    action: function() { /* do something */ } }
        ];

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
      api.on('djAdvance', songChange);    
    };
  }

  exports.PluginTemplate = PluginTemplate;
}());