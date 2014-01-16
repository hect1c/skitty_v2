(function () {
  // the soul of our beloved bot
  function Skitty (model) {
    model = model || {};
    var self = this,
        api = {},
        core = {},
        currentSong = null,
        voteReqCount = 0,
        maxMsgSent = false,
        botAcctInfo = {},
        gifs = model.resources.gifs;

    // <action methods>
      function showMessage (msg, doBop, data) {
        if (!doBop || (doBop && currentSong)) {
          core.showMessage(msg, data);  
        }
        
        if (doBop) {
          bop(false);
        }
      }

      function bop (speak) {
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
        { trigger: 'mmm', action: bop.bind(this, false) },
        { trigger: 'love', action: bop.bind(this, false) },

        // gifs
        { trigger: 'dance',        action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'boogie',       action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'groove',       action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'bounce',       action: showMessage.bind(this, gifs.dance, true) },
        { trigger: 'trippy',       action: showMessage.bind(this, gifs.trippy, true) },
        { trigger: 'chill',        action: showMessage.bind(this, gifs.chill, true) },
        { trigger: 'smooth',        action: showMessage.bind(this, gifs.smooth, true) },

        { trigger: 'meow',         action: showMessage.bind(this, gifs.meow, false) },
        { trigger: 'prrr',         action: showMessage.bind(this, gifs.prrr, false) },
        { trigger: 'pur',          action: showMessage.bind(this, gifs.prrr, false) },
        { trigger: 'twerk',        action: showMessage.bind(this, gifs.twerk, false) },
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
        { trigger: 'gross',        action: showMessage.bind(this, gifs.gross, false) },
        { trigger: 'barf',        action: showMessage.bind(this, gifs.gross, false) },

        // generic responses
        { trigger: 'quote', action: showMessage.bind(this, model.resources.quotes, false) },
        { trigger: 'rude',  action: showMessage.bind(this, model.resources.rudeResponses.generic, false) },
        { trigger: 'lol',   action: showMessage.bind(this, model.resources.funnyResponses.generic, false) },
        { trigger: 'haha',  action: showMessage.bind(this, model.resources.funnyResponses.generic, false) },

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
      function songChange (data) {
        voteReqCount = 0;
        maxMsgSent = false;
        currentSong = data.media;
      }

      function joinRoom (data) {
        botAcctInfo = api.getSelf();
        currentSong = data.room.media;
        api.sendChat(model.resources.info.roomEnter);
      }
    // </subscription methods>

    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      // subscriptions
      api.on('chat', core.checkCommands.bind(core, chatCommands));
      api.on('roomJoin', joinRoom);
      api.on('djAdvance', songChange);
    };
  }

  exports.Skitty = Skitty;
}());