(function () {
  var PlugAPI = require('./lib/plugapi'),
      PlugBot = require('./plugBot').Bot,
      Skitty = require('./modules/skitty').Skitty,
      PlaylistManager = require ('./modules/playlistManager').PlaylistManager;

  var model = {
        room: '',
        updateCode: '$&2h72=^^@jdBf_n!`-38UHs', 
        auth: '',
      },
      plugins = [ 
        new Skitty(),
        new PlaylistManager({ defaultPlaylist: 'snags' })
      ];

      
  var skitty = new PlugBot(model, PlugAPI, plugins);
}());
