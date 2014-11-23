var plug = Npm.require('plugapi');

var reconnectAttempts = 0;

SkittyPlugApi = {
    //Instantiate PlugAPI
    api: function(auth, con) {
        var plugObj = new plug(auth);

        //setup connection variables
        var delay = con.delay || 0;
        con.attempts = con.attempts || 100;

        //@todo Test to see if this function is working or necessary
        var reconnect = function(err) {
            var err = arguments;

            if (reconnectAttempts < con.attempts) {
                setTimeout(function() {
                    console.log('Disconnected ' + err);
                    plugObj.connect(con.room);
                }, delay);

                reconnectAttempts++;
            }
        }

        //Recoonect upon these events
        plugObj.on('close', reconnect);
        plugObj.on('error', reconnect);

        //connect
        plugObj.on('roomJoin', function(room) {
            console.log('Joined ' + room);
        });
        plugObj.connect(con.room);
        //return obj
        return plugObj;
    },

    isFirstConnect: function(){
        return reconnectAttempts === 0;
    }
}