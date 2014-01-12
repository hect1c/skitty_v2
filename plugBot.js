(function () {
  // local dependencies 
  var PlugApi = require('./lib/plugapi');
      PlugCore = require('./modules/core').PlugCore;

  // <skeleton plugbot>
    function Bot (model, plugins) {     
      model = model || {};
      var api = new PlugApi(model.auth, model.updateCode),
          core = new PlugCore(api);

      // register plugins
      for (var i = 0; i < plugins.length; i++) {
        plugins[i].init(api, core);
      }

      // <auto-reconnect>
        var delay = model.reconnectDelay || 0,
            tries = 0;

        model.reconnectAttempts = model.reconnectAttempts || 100;

        var reconnect = function() {
          var err = arguments; 
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