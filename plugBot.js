(function () {
  // local dependencies
  var PlugApi = require('plugapi'),
      PlugCore = require('./modules/core/plugCore').PlugCore;

  // <skeleton plugbot>
    function Bot (model, plugins) {
      var self = this;

      self.reconnectAttempts = 0;

      PlugApi.getUpdateCode(model.auth, model.room, function(error, updateCode) {
        if(error === false) {
          var api = new PlugApi(model.auth, updateCode),
              core = new PlugCore(self, api);

          // register plugins
          for (var i = 0; i < plugins.length; i++) {
            plugins[i].init(api, core);
          }

          // <auto-reconnect>
            var delay = model.reconnectDelay || 0;

            model.reconnectAttempts = model.reconnectAttempts || 100;

            var reconnect = function() {
              var err = arguments;
              if (self.reconnectAttempts < model.reconnectAttempts) {
                setTimeout(function () {
                  console.log('Disconnected.');
                  console.log(err);
                  api.connect(model.room);
                }, delay);

                self.reconnectAttempts++;
              }
            };

            api.on('close', reconnect);
            api.on('error', reconnect);
          // </auto-reconnect>

          // connect
          api.on('roomJoin', function(data) {
            console.log('Connected to: ' + data.room.name);
          });
          api.connect(model.room);
        } else {
          console.log(error);
        }
      });
    }
  // </skeleton plugbot>

  exports.Bot = Bot;
}());