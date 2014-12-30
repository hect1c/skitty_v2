'use strict';

// Allows the bot application to be exited from chat using a two-step process.
//   Useful in case a bug causes a chat loop or something silly like that ;)
SkittyKillSwitch = function() {
    var self = this,
        api = {},
        core = {},
        killStagedBy = null,
        timeout = 5000;

    self.stageKill = function(data) {
        if (core.hasPermission(data.from.id) && !killStagedBy) {
            killStagedBy = data.from.id;
            core.showMessage(SkittyResource.call('info', 'killSwitch.confirm'));

            // TODO: make auto-unstage configurable via model
            setTimeout(function() {
                killStagedBy = null;
            }, timeout );
        }

        return killStagedBy;
    }

    self.terminate = function(data) {
        // only the person who staged the kill can execute it
        if (core.hasPermission(data.from.id) && data.from.id === killStagedBy) {
            core.showMessage(SkittyResource.call('info', 'killSwitch.logoff'));

            setTimeout(function() {
                console.log(' exited by user: ' + killStagedBy);
                process.exit();
            }, 500);
        }
    }

    self.cancel = function(data) {
        // only the person who staged the kill can cancel it
        if (core.hasPermission(data.from.id) && data.from.id === killStagedBy) {
            core.showMessage(SkittyResource.call('info', 'killSwitch.cancel'));
            killStagedBy = null;
        }
    }

    var chatCommands = [{
        trigger: 'exit',
        action: self.stageKill
    }, {
        trigger: 'yes',
        action: self.terminate
    }, {
        trigger: 'no',
        action: self.cancel
    }];

    // add subscriptions and init code here
    self.init = function(plugApi, pluginCore) {
        api = plugApi;
        core = pluginCore;

        if (core.isFirstConnect()) {
            // subscriptions
            api.on('chat', Meteor.bindEnvironment( core.checkCommands.bind(core, chatCommands)));
        }
    };
}
