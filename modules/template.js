(function () {
  // plugins should be initialized before passing them into the plug bot
  //   the api will be passed via the init function

  function PluginTemplate (model) {
    var self = this,
        api = {};

    // your plugin code here

    self.init = function (plugApi) {
      api = plugApi;

      // add subscriptions and init code here    
    };
  }

  exports.PluginTemplate = PluginTemplate;
}());