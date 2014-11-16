'use strict';

module.exports = function(config, db){
    /**
     * PlugDJ Module dependencies
     */
    var PlugBot = require('./plugdj/plugBot').Bot,

    /**
     * Skitty Bot Module dependencies
     */
        StatsDb     = require('./playlist-manager/statsDb').StatsDb,
        Skitty      = require('./skitty/main').Skitty,
        InfoPlugin  = require('./skitty/info').InfoPlugin,
        Dj          = require ('./skitty/dj').Dj,
        StatTracker = require('./playlist-manager/statsTracker').StatTracker,
        KillSwitch  = require('./skitty/killSwitch').KillSwitch,
        Curmudgeon  = require('./skitty/curmudgeon').Curmudgeon,

    /**
     * TT Module dependencies
     * @todo Determine if this module is still necessary
     */
        TurntableStats = require('./turntable/ttApi').TurntableStats,

    /**
     * Resources
     */
        resources = {
            info:           require('./skitty/resources/info'),
            gifs:           require('./skitty/resources/gifs'),
            quotes:         require('./skitty/resources/quotes'),
            funnyResponses: require('./skitty/resources/funny_responses'),
            dj:             require('./skitty/resources/dj'),
            stats:          require('./skitty/resources/stats'),
            facts:          require('./skitty/resources/facts'),
            curmudgeon:     require('./skitty/resources/curmudgeon')
        };


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
    return new PlugBot(model, plugins);
};