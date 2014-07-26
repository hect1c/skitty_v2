'use strict';

/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),

/**
 * PlugDJ Module dependencies
 */
    PlugBot = require('./app/modules/plugdj/plugBot').Bot,

/**
 * Skitty Bot Module dependencies
 */
    StatsDb = require('./app/modules/playlist-manager/statsDb').StatsDb,
    Skitty =      require('./app/modules/skitty/main').Skitty,
    InfoPlugin =  require('./app/modules/skitty/info').InfoPlugin,
    Dj =          require ('./app/modules/skitty/dj').Dj,
    StatTracker = require('./app/modules/playlist-manager/statsTracker').StatTracker,
    KillSwitch =  require('./app/modules/skitty/killSwitch').KillSwitch,
    Curmudgeon =      require('./app/modules/skitty/curmudgeon').Curmudgeon,

/**
 * TT Module dependencies
 * @todo Determine if this module is still necessary
 */
    TurntableStats = require('./app/modules/turntable/ttApi').TurntableStats,

/**
 * Resources
 */
    resources = {
        info:           require('./app/modules/skitty/resources/info'),
        gifs:           require('./app/modules/skitty/resources/gifs'),
        quotes:         require('./app/modules/skitty/resources/quotes'),
        funnyResponses: require('./app/modules/skitty/resources/funny_responses'),
        dj:             require('./app/modules/skitty/resources/dj'),
        stats:          require('./app/modules/skitty/resources/stats'),
        facts:          require('./app/modules/skitty/resources/facts'),
        curmudgeon:     require('./app/modules/skitty/resources/curmudgeon')
    };

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db);

// define bot model
  var model = {
        room: config.room,
        auth: config.auth,
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
          autoDj: true,
          autoDjThreshold: 0,
          resources: {
            generic: resources.info,
            dj: resources.dj
          }
        }),
        new StatTracker({
          announcePlayStats: false,
          announceSongPlay: true,
          resources: {
            generic: resources.info,
            stats: resources.stats
          },
          stats: new StatsDb( db, ['songPlays'] )
        }),
        new InfoPlugin({
          resources: resources.info
        }),
        new KillSwitch({
          timeout: 5000,
          resources: resources.info.killSwitch
        }),
        new Curmudgeon({
          resources: resources.curmudgeon
        })
      ];

 // run bot
var skitty = new PlugBot(model, plugins);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);