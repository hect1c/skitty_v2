//Setup variables/requires
var _ = lodash;

/**
 * Skitty Core Class
 *
 * Maintains core methods and skitty functionality
 * to be used in various modules
 *
 * @param {{object}} api PlugApi Object
 */
SkittyCore = function(api) {
    api = api || null;

    var self = this,
        msgSent = false,
        voteReqCount = 0,
        currentSong = null,
        maxMsgSent = false,
        botAcctInfo = {};

    self.hasPermission = function(userId) {
        // console.log(api);
        var hasPermission = false;
        _.forEach(api.getStaff(), function(user) {
            hasPermission = _.contains(user, userId) || hasPermission;
            if (hasPermission) return false;
        });
        return hasPermission;
    }

    self.showMessage = function(msg, data) {
        if (msg) {
            var message = msg;

            // if a collection is passed the selection is randomized
            if (Object.prototype.toString.call(msg) === '[object Array]') {
                var i = Math.round(Math.random() * (msg.length - 1));
                message = msg[i];
            }

            // if data is passed check for sender placeholder
            if (data) {
                message = message.replace('{sender}', '@' + data.raw);
            }

            api.sendChat('/em ' + message);
            msgSent = true;

            return msgSent;
        }
    }

    // checks against array of trigger/action sets and fires trigger if match is found
    //  NOTE: matching is case-insensitive
    self.checkCommands = function(chatCommands, data) {
        if (!self.botInfo) {
            self.botInfo = api.getSelf();
        }

        // don't evaluate messages sent by self
        if (self.botInfo.id !== data.raw.id) {
            var msg = data.message.trim().toLowerCase();

            for (var i in chatCommands) {
                // make match check case-insensitive

                // wildcard check
                if (chatCommands[i].wildCard && msg.indexOf(chatCommands[i].trigger.toLowerCase()) !== -1) {
                    chatCommands[i].action(data);
                    return chatCommands[i].action(data);
                }

                // command check
                if ((msg.indexOf('.') === 0 ||
                        msg.indexOf('!') === 0 ||
                        msg.indexOf('?') === 0) &&
                    msg.indexOf(chatCommands[i].trigger) === 1) {
                    chatCommands[i].action(data);
                    return chatCommands[i].action(data);
                }
            }
        }

        return false;
    }

    self.bop = function(speak) {
        console.log(currentSong);
        if (voteReqCount === 0 && currentSong) {
            api.woot();

            if (speak) {
                api.sendChat('Bonus. :thumbsup:');
            }
        } else if (speak && !maxMsgSent) {
            api.sendChat('Bonuses to the max! Good play youse. :thumbsup:');
            maxMsgSent = true;
        } else if (!currentSong && speak) {
            api.sendChat('There ain\'t nothing to bop to kid!');
        }

        voteReqCount++;
    }

    self.songChange = function(data){
        // console.log(data);
        voteReqCount = 0;
        maxMsgSent = false;
        currentSong = data.media;

        return currentSong;
    }

    self.joinRoom = function(data){
        botAcctInfo = api.getSelf();
        currentSong = api.getMedia();
        api.sendChat('Im bacccccckkk!');
    }

    return self;
}
