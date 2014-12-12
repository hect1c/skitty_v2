'use strict';

// the soul of our beloved bot
Skitty = function() {
    var self = this,
        api = {},
        core = {},
        currentSong = null,
        voteReqCount = 0,
        maxMsgSent = false,
        result = false,
        botAcctInfo = {};

    // <action methods>
    self.showMessage = function(msg, doBop, data) {
        if (!doBop || (doBop && currentSong)) {
            var result = core.showMessage(msg, data);
        }

        if (doBop) {
            this.bop(false);
            result = true;
        }

        return result;
    }

    self.bop = function(speak) {
            if (voteReqCount === 0 && currentSong) {
                api.woot();

                if (speak) {
                    api.sendChat('/em Bonus. :thumbsup:');
                }

                voteReqCount++;
                maxMsgSent = true; //set max to true on upvote
            } else if (speak && maxMsgSent === true) {
                api.sendChat('/em Bonuses to the max! Good play youse. :thumbsup:');
                maxMsgSent = true;
            } else if (!currentSong && speak) {
                api.sendChat('/em There ain\'t nothing to bop to kid!');
            }

            return voteReqCount;
        }
        // </action methods>


    // <chat commands>
    // @todo Create seperate package for chatcommands?
    // and implement collections on chatcommands with gifs and test based response
    var chatCommands = [
        // bop and snag
        {
            trigger: 'woot',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'awesome',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'bonus',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'props',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'badass',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'groovy',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'nice',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'sick',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'dig',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'dope',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'jazzy',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'funky',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'snag',
            action: this.bop.bind(this, false)
        }, {
            trigger: 'nomnom',
            action: this.bop.bind(this, false)
        }, {
            trigger: 'currate',
            action: this.bop.bind(this, false)
        }, {
            trigger: 'mmm',
            action: this.bop.bind(this, true)
        }, {
            trigger: 'love',
            action: this.bop.bind(this, true)
        },

        // bop and gif
        {
            trigger: 'dance',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'smiffDance'), true)
        }, {
            trigger: 'boogie',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'dance'), true)
        }, {
            trigger: 'groove',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'dance'), true)
        }, {
            trigger: 'bounce',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'dance'), true)
        }, {
            trigger: 'rave',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'rave'), true)
        }, {
            trigger: 'trippy',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'trippy'), true)
        }, {
            trigger: 'chill',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'chill'), true)
        }, {
            trigger: 'smooth',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'smooth'), true)
        },

        // gif only
        {
            trigger: 'meow',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'meow'), false)
        }, {
            trigger: 'prrr',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'prrr'), false)
        }, {
            trigger: 'pur',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'prrr'), false)
        }, {
            trigger: 'twerk',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'twerk'), false)
        }, {
            trigger: 'milkshake',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'milkshake'), false)
        }, {
            trigger: 'thuglife',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'thugLife'), false)
        }, {
            trigger: 'fail',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'fail'), false)
        }, {
            trigger: 'wut',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'wut'), false)
        }, {
            trigger: 'ynb',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'whynotboth'), false)
        }, {
            trigger: 'cry',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'cry'), false)
        }, {
            trigger: 'flow',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'poorFlow'), false)
        }, {
            trigger: 'poorflow',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'poorFlow'), false)
        }, {
            trigger: 'flowkill',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'poorFlow'), false)
        }, {
            trigger: 'haters',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'haters'), false)
        }, {
            trigger: 'hatehatehate',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'haters'), false)
        }, {
            trigger: 'silence',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'silence'), false)
        }, {
            trigger: 'nosound',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'silence'), false)
        }, {
            trigger: 'gross',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'gross'), false)
        }, {
            trigger: 'barf',
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'gross'), false)
        },

        // text-based responses
        {
            trigger: 'catfacts',
            action: this.showMessage.bind(this, SkittyResource.call('facts', 'catfacts'), false)
        }, {
            trigger: 'pandafacts',
            action: this.showMessage.bind(this, SkittyResource.call('facts', 'pandafacts'), false)
        },

        // generic responses
        {
            trigger: 'quote',
            action: this.showMessage.bind(this, SkittyResource.call('quotes'), false)
        },

        {
            trigger: 'lol',
            action: this.showMessage.bind(this, SkittyResource.call('funny_responses', 'generic'), false)
        }, {
            trigger: 'haha',
            action: this.showMessage.bind(this, SkittyResource.call('funny_responses', 'generic'), false)
        },

        // wildcard triggers
        {
            trigger: 'motorboat',
            wildCard: true,
            action: this.showMessage.bind(this, SkittyResource.call('gifs', 'motorboat'), false)
        }, {
            trigger: 'Supercalifragilisticexpialidocious',
            wildCard: true,
            action: this.showMessage.bind(this, SkittyResource.call('funny_responses', 'magicWord'), false)
        },

        //Bitbucket Issue
        {
            trigger: 'reportbug',
            action: this.showMessage.bind(this, SkittyResource.call('info', 'issuetracker'), false)
        }
    ];
    // </chat commands>

    // <subscription methods>
    self.songChange = function(data) {
        voteReqCount = 0;
        maxMsgSent = false;
        result = false;
        currentSong = api.getMedia();
        return currentSong;
    }

    self.joinRoom = function(data) {
            botAcctInfo = api.getSelf();
            currentSong = api.getMedia();
            api.sendChat("/em Meoooooowwwwwwwwwww!");
            return botAcctInfo;
        }
        // </subscription methods>

    self.init = function(plugApi, pluginCore) {
        api = plugApi;
        core = pluginCore;

        if (core.isFirstConnect()) {
            // subscriptions
            api.on('chat', core.checkCommands.bind(core, chatCommands));
            api.on('roomJoin', this.joinRoom);
            api.on('advance', this.songChange);
        }
    };
}
