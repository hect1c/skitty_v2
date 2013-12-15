(function () {
  // <skeleton plugbot>
    function Bot (model, plugApi, plugins) {     
      model = model || {};
      var api = new plugApi(model.auth, model.updateCode);

      // register plugins
      for (var i = 0; i < plugins.length; i++) {
        plugins[i].init(api);
      }

      // <auto-reconnect>
        var delay = model.reconnectDelay || 0,
            tries = 0;

        model.reconnectAttempts = model.reconnectAttempts || 100;

        var reconnect = function(err) { 
          if (tries < model.reconnectAttempts) {
            setTimeout(function () {
              console.log('Disconnected.');
              console.log(err);
              api.connect(model.room); 
            }, delay);

            tries++;
          }
        };

        api.on('close', reconnect);
        api.on('error', reconnect);
      // </auto-reconnect>

      // connect
      api.on('roomJoin', function(data) {
        console.log('Connected to: ' + data.room.name);
        tries = 0;
      });
      api.connect(model.room);
    }
  // </skeleton plugbot>

  exports.Bot = Bot;
}());