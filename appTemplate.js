(function () {
      // import core modules
  var PlugAPI = require('./lib/plugapi'),
      PlugBot = require('./plugBot').Bot,
      
      // import bot plugin modules
      Skitty = require('./modules/skitty').Skitty,
      PlaylistManager = require ('./modules/playlistManager').PlaylistManager;

      // define bot model
  var model = {
        room: 'coding-soundtrack-lounge',
        updateCode: '$&2h72=^^@jdBf_n!`-38UHs', 
        auth: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },

      // create plugins
      plugins = [ 
        new Skitty({
          resources: {
            info: require('./resources/info'),
            gifs: require('./resources/gifs'),
            quotes: require('./resources/quotes'),
            rudeResponses: require('./resources/rude_responses'),
            funnyResponses: require('./resources/funny_responses')
          }
        }),
        new PlaylistManager({ defaultPlaylist: 'snags' })
      ];

      // create bot
  var skitty = new PlugBot(model, PlugAPI, plugins);
}());
