(function () {
  // import core modules
  var mongojs = require("mongojs"),
      PlugAPI = require('./lib/plugapi'),
      PlugBot = require('./plugBot').Bot,

      // import bot plugin modules
      Skitty =      require('./modules/skitty').Skitty,
      InfoPlugin =  require('./modules/info').InfoPlugin,
      Dj =          require ('./modules/dj').Dj,
      StatTracker = require('./modules/statTracker').StatTracker,
      KillSwitch =      require('./modules/killSwitch').KillSwitch,

      // import resources
      resources = {
        info:           require('./resources/info'),
        gifs:           require('./resources/gifs'),
        quotes:         require('./resources/quotes'),
        rudeResponses:  require('./resources/rude_responses'),
        funnyResponses: require('./resources/funny_responses'),
        dj:             require('./resources/dj'),
        stats: require('./resources/stats')
      };

  // define bot model
  var model = {
        room: 'coding-soundtrack-lounge',
        updateCode: '***REMOVED***', 
        auth: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        reconnectDelay: 1000,
        reconnectAttempts: 5 
      },
  
      // create plugins
      plugins = [ 
        new Skitty({
          resources: resources
        }),
        new Dj({ 
          defaultPlaylist: 'snags',
          autoDj: false,
          autoDjThreshold: 0,
          resources: {
            generic: resources.info,
            dj: resources.dj
          }
        }),
        new StatTracker({
          announcePlayStats: false,
          resources: {
            generic: resources.info,
            stats: resources.stats
          },
          db: mongojs.connect('mongodb://<user>:<password>@linus.mongohq.com:10065/tt-db', ["songPlays"])
        }),
        new InfoPlugin({ 
          resources: resources.info
        }),
        new KillSwitch({
          timeout: 5000
        })
      ];

  // run bot
  var skitty = new PlugBot(model, PlugAPI, plugins);
    
  // start simple webserver
  var express = require('express'),
      app = express();
  
  app.get('/', function(req, res) {
    res.send('meow.');
  });
  
  app.listen(process.env.VCAP_APP_PORT || 3000);
}());
