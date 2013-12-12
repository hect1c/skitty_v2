(function () {
  function Skitty () {
    var self = this,
        voteReqCount = 0,
        maxMsgSent = false,
        gifs = {
          haters: [
            'http://bit.ly/csl-haters',
            'http://bit.ly/csl-haters-01'
          ],
          meow: [
            'http://bit.ly/csl-meow',
            'http://bit.ly/csl-meow-01'
          ],
          trippy: [
            'http://bit.ly/efrul',
            'http://bit.ly/1bhcBEj'
          ],
          dance: [
            'http://bit.ly/csl-dance'
          ],
          chill: [
            'http://bit.ly/csl-chill'
          ]
        };


    // <action methods>
      function showTheme () {
        var now = new Date(),
              days = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
              day = days[ now.getDay() ];

          if (day === 'Friday') {
            api.sendChat("Funky Fuckin' Friday! Every Friday we implement a theme: Electro Soul, Glitch, Funk, Hip Hop, medium Dubstep(if it has some funk to it) ...as long as it has a sick beat and some funk you're winning.");
          } else {
            api.sendChat("No theme active. See room info for music format details.");
          }
      }

      function showMessage (msg, doBop) {
        var message = msg;

        // if a collection is passed the selection is randomized
        if( Object.prototype.toString.call( msg ) === '[object Array]' ) {
          var i = Math.round(Math.random()*(msg.length-1));
          message = msg[i];
        }

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
        { trigger: '.woot',     action: bop.bind(this, true) },
        { trigger: '.awesome',  action: bop.bind(this, true) },
        { trigger: '.bonus',    action: bop.bind(this, true) },
        { trigger: '.props',    action: bop.bind(this, true) },
        { trigger: '.badass',   action: bop.bind(this, true) },
        { trigger: '.groovy',   action: bop.bind(this, true) },
        { trigger: '.nice',     action: bop.bind(this, true) },
        { trigger: '.sick',     action: bop.bind(this, true) },
        { trigger: '.dope',     action: bop.bind(this, true) },
        { trigger: '.jazzy',    action: bop.bind(this, true) },
        { trigger: '.funky',    action: bop.bind(this, true) },
        // { trigger: '.snag',     action: snag },
        // { trigger: '.nomnom',   action: snag },
        // { trigger: '.currate',  action: snag },

        // gif
        { trigger: '.dance',    action: showMessage.bind(this, gifs.dance, true) },
        { trigger: '.boogie',   action: showMessage.bind(this, gifs.dance, true) },
        { trigger: '.trippy',   action: showMessage.bind(this, gifs.trippy, true) },
        { trigger: '.chill',    action: showMessage.bind(this, gifs.chill, true) },
        { trigger: '.meow',     action: showMessage.bind(this, gifs.meow, false) },

        // info
        { trigger: '.cmds',     action: showMessage.bind(this, 'http://bit.ly/skittyCommands', false) },
        { trigger: '.commands', action: showMessage.bind(this, 'http://bit.ly/skittyCommands', false) },
        { trigger: '.theme',     action: showTheme }
      ];
    // </chat commands>

    // <subscription methods>
      function checkCommands (data) {
        for (var i = 0; i < chatCommands.length; i++) {
          var msg = data.message.trim();
          if (msg.indexOf(chatCommands[i].trigger) >= 0) {
            chatCommands[i].action(data);
            return;
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
      api.on('chat', checkCommands);
      api.on('djAdvance', songChange);
    };
  }

  exports.Skitty = Skitty;
}());