'use strict';

// plugin that provides information about the room, djs and songs playing
SkittyInfo = function() {
    var self = this,
        api = {},
        core = {};

    self.showTheme = function() {
        var now = new Date(),
            days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day = days[now.getDay()];

        if (day === 'Friday') {
            core.showMessage(SkittyResource.call( 'info', 'theme.funkyFriday'));
        } else {
            core.showMessage(SkittyResource.call( 'info', 'theme.none'));
        }
    }

    self.showMessage = function(message, data) {
        core.showMessage(message, data);
    }

    //Instantiate chatCommands
    var chatCommands = [{
        trigger: 'cmds',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'commands'))
    }, {
        trigger: 'commands',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'commands'))
    }, {
        trigger: 'help',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'commands'))
    }, {
        trigger: 'help',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'commands'))
    }, {
        trigger: 'plugapi',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'plugapi'))
    }, {
        trigger: 'src',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'src'))
    }, {
        trigger: 'rules',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'rules'))
    }, {
        trigger: 'report',
        action: self.showMessage.bind(this, SkittyResource.call( 'info', 'report'))
    }, {
        trigger: 'theme',
        action: Meteor.bindEnvironment( this.showTheme )
    }];

    self.init = function(plugApi, pluginCore) {
        api = plugApi;
        core = pluginCore;

        if (core.isFirstConnect()) {
            api.on('chat', core.checkCommands.bind(core, chatCommands));
        }
    };
}
