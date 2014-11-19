SkittyPlugApi = {};

var plugApi = Npm.require('plugapi');
var reconnectAttempts = 0;

SkittyPlugApi.connect = function(auth, con) {
    //Instantiate PlugAPI
    var api = new plugApi(auth);
    //setup connection variables
    var delay = con.delay || 0;
    con.attempts = con.attempts || 100;

    var reconnect = function() {
        var err = arguments;
        console.dir( arguments );

        if( reconnectAttempts < con.attempts ){
            setTimeout( function(){
                console.log('Disconnected ' + err );
                api.connect(con.room);
            });
        }
    }

    //Recoonect upon these events
    api.on('close',reconnect);
    api.on('error',reconnect);

    //connect
    api.on('roomJoin', function(room){
        console.log('Joined ' + room);
    });

    api.connect(con.room);
}

SkittyPlugApi.isFirstConnect = function() {
    return reconnectAttempts === 0;
}
