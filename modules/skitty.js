(function () {
  // the soul of our beloved bot
  function Skitty (model) {
    model = model || {};
    var self = this,
        api = {},
        voteReqCount = 0,
        maxMsgSent = false,
        botAcctInfo = {},
        gifs = model.resources.gifs;

    // <action methods>
      function showMessage (msg, doBop, data) {
        var message = msg;

        // if a collection is passed the selection is randomized
        if( Object.prototype.toString.call( msg ) === '[object Array]' ) {
          var i = Math.round(Math.random()*(msg.length-1));
          message = msg[i];
        }

        message = message.replace('{sender}', '@' + data.from);

        api.sendChat(message);

        if (doBop) {
          bop(false);
        }
      }

      function bop (speak) {
        if (voteReqCount === 0) {
          api.woot();

          if (speak) {
            api.sendChat('Bonus. :thumbsup:');
          }
        } else if (speak && !maxMsgSent) {
          api.sendChat('Bonuses to the max! Good play youse. :thumbsup:');
          maxMsgSent = true;
        }

        voteReqCount++;
      }
    // </action methods>

    // <chat commands>
      var chatCommands = [
        // bop and snag
        { trigger: 'woot',    action: bop.bind(this, true) },
        { trigger: 'awesome', action: bop.bind(this, true) },
        { trigger: 'bonus',   action: bop.bind(this, true) },
        { trigger: 'props',   action: bop.bind(this, true) },
        { trigger: 'badass',  action: bop.bind(this, true) },
        { trigger: 'groovy',  action: bop.bind(this, true) },
        { trigger: 'nice',    action: bop.bind(this, true) },
        { trigger: 'sick',    action: bop.bind(this, true) },
        { trigger: 'dig',     action: bop.bind(this, true) },
        { trigger: 'dope',    action: bop.bind(this, true) },
        { trigger: 'jazzy',   action: bop.bind(this, true) },
        { trigger: 'funky',   action: bop.bind(this, true) },
        { trigger: 'snag',    action: bop.bind(this, false) },
        { trigger: 'nomnom',  action: bop.bind(this, false) },
        { trigger: 'currate', action: bop.bind(this, false) },

        // gifs
        { trigger: 'dance',        action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'boogie',       action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'groove',       action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'bounce',       action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'trippy',       action: showMessage.bind(this, gifs.trippy, true) },
        { trigger: 'chill',        action: showMessage.bind(this, gifs.chill, true) },
        { trigger: 'meow',         action: showMessage.bind(this, gifs.meow, false) },
        { trigger: 'twerk',        action: showMessage.bind(this, gifs.twerk, true) },
        { trigger: 'milkshake',    action: showMessage.bind(this, gifs.milkshake, false) },
        { trigger: 'thuglife',     action: showMessage.bind(this, gifs.thugLife, false) },
        { trigger: 'fail',         action: showMessage.bind(this, gifs.fail, false) },
        { trigger: 'wut',          action: showMessage.bind(this, gifs.wut, false) },
        { trigger: 'ynb',          action: showMessage.bind(this, gifs.whynotboth, false) },
        { trigger: 'cry',          action: showMessage.bind(this, gifs.cry, false) },
        { trigger: 'flow',         action: showMessage.bind(this, gifs.poorFlow, false) },
        { trigger: 'poorflow',     action: showMessage.bind(this, gifs.poorFlow, false) },
        { trigger: 'flowkill',     action: showMessage.bind(this, gifs.poorFlow, false) },
        { trigger: 'haters',       action: showMessage.bind(this, gifs.haters, false) },
        { trigger: 'hatehatehate', action: showMessage.bind(this, gifs.haters, false) },
        { trigger: 'silence',      action: showMessage.bind(this, gifs.silence, false) },
        { trigger: 'nosound',      action: showMessage.bind(this, gifs.silence, false) },

        // generic responses
        { trigger: 'quote', action: showMessage.bind(this, model.resources.quotes, true) },
        { trigger: 'rude',  action: showMessage.bind(this, model.resources.rudeResponses.generic, true) },
        { trigger: 'lol',   action: showMessage.bind(this, model.resources.funnyResponses.generic, true) },
        { trigger: 'haha',  action: showMessage.bind(this, model.resources.funnyResponses.generic, true) },

        // wildcard triggers
        { trigger: 'fuck you s\'kitty', wildCard: true, action: showMessage.bind(this, model.resources.rudeResponses.fuckYou, false) },
        { trigger: 'fuck you skitty',   wildCard: true, action: showMessage.bind(this, model.resources.rudeResponses.fuckYou, false) },
        { trigger: 'woah',              wildCard: true, action: showMessage.bind(this, model.resources.rudeResponses.whoa, false) },
        { trigger: 'whoa',              wildCard: true, action: showMessage.bind(this, model.resources.rudeResponses.whoa, false) },
        { trigger: 'exactly',           wildCard: true, action: showMessage.bind(this, model.resources.rudeResponses.exactly, false) },
        { trigger: 'motorboat',         wildCard: true, action: showMessage.bind(this, gifs.motorboat, false) },
        { trigger: 'Supercalifragilisticexpialidocious', wildCard: true, action: showMessage.bind(this, model.resources.funnyResponses.magicWord, false) }
      ];
    // </chat commands>

    // <subscription methods>
      function checkCommands (data) {
        // don't evaluate messages sent by self
        if (botAcctInfo.id !== data.fromID) {
          var msg = data.message.trim();

          for (var i = 0; i < chatCommands.length; i++) {
            // wildcard check
            if (chatCommands[i].wildCard && msg.match(chatCommands[i].trigger)) {
              chatCommands[i].action(data);
              return;
            }

            // command check
            if (( msg.indexOf('.') === 0 ||
                  msg.indexOf('!') === 0 ||
                  msg.indexOf('?') === 0) &&
                  msg.indexOf(chatCommands[i].trigger) === 1) {
              chatCommands[i].action(data);
              return;
            }
          }
        }
      }

      function songChange () {
        voteReqCount = 0;
        maxMsgSent = false;
      }
    // </subscription methods>

    self.init = function (plugApi) {
      api = plugApi;

      // subscriptions
      api.on('roomJoin', function () {
        botAcctInfo = api.getSelf();
      });
      api.on('chat', checkCommands);
      api.on('djAdvance', songChange);
    };
  }

  exports.Skitty = Skitty;
}());