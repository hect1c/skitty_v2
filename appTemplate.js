(function () {
  // import core modules
  var PlugAPI = require('./lib/plugapi'),
      PlugBot = require('./plugBot').Bot,

      // import bot plugin modules
      Skitty = require('./modules/skitty').Skitty,
      InfoPlugin = require('./modules/info').InfoPlugin,
      PlaylistManager = require ('./modules/playlistManager').PlaylistManager,
      StatTracker =     require('./modules/statTracker').StatTracker;

  // define bot model
  var model = {
        room: 'coding-soundtrack-lounge',
        updateCode: '_:8s[H@*dnPe!nNerEM',
        auth: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        reconnectDelay: 1000,
        reconnectAttempts: 5
      },

      // create plugins
      plugins = [
        new Skitty({
          resources: {
            gifs: require('./resources/gifs'),
            quotes: require('./resources/quotes'),
            rudeResponses: require('./resources/rude_responses'),
            funnyResponses: require('./resources/funny_responses')
          }
        }),
        new PlaylistManager({ 
          defaultPlaylist: 'snags' 
        }),
        new StatTracker({
          announcePlayStats: true,
          resources: require('./resources/info') 
        }),
        new InfoPlugin({ 
          resources: require('./resources/info') 
        })
      ];

    // run bot
    var skitty = new PlugBot(model, PlugAPI, plugins);
    
    
    // start simple webserver
    var app = require('express').createServer();
    app.get('/', function(req, res) {
      res.send('meow.');
    });
    app.listen(process.env.VCAP_APP_PORT || 3000);
}());
