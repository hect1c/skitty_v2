(function () {
  var PlugAPI = require('./lib/plugapi'),
      PlugBot = require('./plugBot').Bot,
      Skitty = require('./modules/skitty').Skitty,
      PlaylistManager = require ('./modules/playlistManager').PlaylistManager;

  var model = {
        room: 'coding-soundtrack-lounge',
        updateCode: '$&2h72=^^@jdBf_n!`-38UHs', 
        auth: 'f9jxkL5LEn+FbBxI67Ff9tqs2gw=?_expires=STE0MDE2NzY1MjMKLg==&user_id=Uyc1MjkzZTE2NjNlMDgzZTFkMDc4YzkxYzInCnAxCi4=&v=STIKLg==',
      },
      plugins = [ 
        new Skitty(),
        new PlaylistManager({ defaultPlaylist: 'snags' })
      ];

      
  var skitty = new PlugBot(model, PlugAPI, plugins);
}());