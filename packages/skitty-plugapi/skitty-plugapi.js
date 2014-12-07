/**
 * Connects to 3rd Party API (PLUG.DJ)
 * & Registers
 *
 * @author <hect1c17@gmail.com>
 * @since 2014-11-29
 */

var plug = Npm.require('plugapi');

SkittyPlugApi = {
    //Instantiate PlugAPI
    run: function(config, modules) {
        var self = this;

        self.reconnectAttempts = 0;

        plugObj = new plug(config.auth),
            core = new SkittyCore(self, plugObj);

        //@todo enable this logic when modules begin to get implemented
        //register modules
        // for( var i = 0; i <= modules.length; i++){
        //     modules[i].init(plugObj, core);
        // }

        //setup connection variables
        var delay = config.con.delay || 0;
        config.con.attempts = config.con.attempts || 100;

        //@todo Test to see if this function is working or necessary
        var reconnect = function(err) {
            var err = arguments;

            if (reconnectAttempts < con.attempts) {
                setTimeout(function() {
                    console.log('Disconnected ' + err);
                    plugObj.connect(config.con.room);
                }, delay);

                self.reconnectAttempts++;
            }
        }

        //Recoonect upon these events
        plugObj.on('close', reconnect);
        plugObj.on('error', reconnect);

        //connect
        plugObj.on('roomJoin', function(room) {
            console.log('Joined ' + room);
        });

        plugObj.connect(config.con.room);

        return {
            plugapi: plugObj,
            core: core
        };
    }
}
