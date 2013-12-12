(function () {
  // <skeleton plugbot>
    function Bot (model, plugApi, plugins) {     
      var api = new plugApi(model.auth, model.updateCode);

      // register plugins
      for (var i = 0; i < plugins.length; i++) {
        plugins[i].init(api);
      }
      
      // connect
      api.connect(model.room);
    }
  // </skeleton plugbot>

  exports.Bot = Bot;
}());