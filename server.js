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
    // Playlist = require('./app/modules/playlist-manager/playlist').Playlist, (Note: This will be the statsDB module)
    Skitty =      require('./app/modules/skitty/main').Skitty,
    InfoPlugin =  require('./app/modules/skitty/info').InfoPlugin,
    Dj =          require ('./app/modules/skitty/dj').Dj,
    StatTracker = require('./app/modules/playlist-manager/statsTracker').StatTracker,
    // KillSwitch =  require('./modules/killSwitch').KillSwitch,
    // Curmudgeon =      require('./modules/curmudgeon').Curmudgeon,

/**
 * TT Module dependencies
 * @todo Determine if this module is still necessary
 */
    //TurntableStats = require('./modules/ttApi').TurntableStats,

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