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

SkittyCore = function(shell, api) {
    api = api || null;

    var self = this,
        msgSent = false,
        voteReqCount = 0,
        currentSong = null,
        maxMsgSent = false,
        botAcctInfo = {};

    /**
     * Checks if user has appropriate permission level
     * @param  {int}  userId Id of user
     * @return {Boolean}        Result of user permission check
     */
    self.hasPermission = function(userId) {
        // console.log(api);
        var hasPermission = false;
        _.forEach(api.getStaff(), function(user) {
            hasPermission = _.contains(user, userId) || hasPermission;
            if (hasPermission) return false;
        });
        return hasPermission;
    }

    /**
     * Checks if first time connecting to plugapi + room
     * @return {Boolean}
     */
    self.isFirstConnect = function() {
      return shell.reconnectAttempts === 0;
    };

    /**
     * Displays message to chat
     * @param  {string} msg  String or message to be sent to chat
     * @param  {[type]} data Not sure?
     * @return {Boolean}      If message has been sent
     */
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
                message = message.replace('{sender}', '@' + data.raw.un);
            }

            api.sendChat(message);
            msgSent = true;

            return msgSent;
        }
    }

    /**
     * checks against array of trigger/
     * action sets and fires trigger if match is found
     * NOTE: matching is case-insensitive
     *
     * @param  {Object} chatCommands Object of commands and actions
     * @param  {Object} data         Object of user and currentsong callback
     * @return {Boolean}
     */
    self.checkCommands = function(chatCommands, data) {
        if (!self.botInfo) {
            self.botInfo = api.getSelf();
        }

        // don't evaluate messages sent by self
        if (self.botInfo.id !== data.raw.uid) {
            var msg = data.message.trim().toLowerCase();

            for (var i in chatCommands) {
                // make match check case-insensitive
                // console.log(chatCommands[i]);
                // wildcard check
                if (chatCommands[i].wildCard && msg.indexOf(chatCommands[i].trigger.toLowerCase()) !== -1) {
                    chatCommands[i].action(data);
                    return true;
                }

                // command check
                if ((msg.indexOf('.') === 0 ||
                        msg.indexOf('!') === 0 ||
                        msg.indexOf('?') === 0) &&
                    msg.indexOf(chatCommands[i].trigger) === 1) {
                    chatCommands[i].action(data);
                    return true;
                }
            }
        }

        return false;
    }
}