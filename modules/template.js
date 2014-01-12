(function () {
  // plugins get initialized before being passed to the plug bot
  //   the api and core module will be provided via the init function

  function PluginTemplate (model) {
    var self = this,
        api = {},
        core = {},
        chatCommands = [
          { trigger: 'woot', action: function() { /* do something */ } }
        ];

    // <subscription methods>
      function songChange (data) {
        // do something
      }
    // </subscription methods>

    // add subscriptions and init code here
    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      api.on('chat', core.checkCommands.bind(core, chatCommands));
      api.on('djAdvance', songChange);    
    };
  }

  exports.PluginTemplate = PluginTemplate;
}());