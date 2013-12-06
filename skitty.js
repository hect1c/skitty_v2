(function () {

  // skeleton plugbot
  function Bot (api, plugins) { 
    // extend api
    api.woot = function() {
      $('#woot').click();
    };

    api.curate = function () {
      $('#curate').click();

      setTimeout(function() {
        $('.pop-menu.curate .icon-active-selected').parent().trigger('click');
      });
    };

    api.meh = function () {
      $('#meh').click();
    };

    // register plugins
    for (var i = 0; i < plugins.length; i++) {
      plugins[i](api);  
    }
  }

  function Skitty (api) {
    var voteReqCount = 0,
        snagReqCount = 0,
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
        },
        chatCommands = [
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
          { trigger: '.commands', action: showMessage.bind(this, 'http://bit.ly/skittyCommands', false) }
        ];


    // <action methods>
      function showMessage (msg, doBop) {        
        var message = msg;
        
        // if a collection is passed the selection is randomized
        if (msg.length) {
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
        } else if (speak && maxMsgSent) {
          api.sendChat('Bonuses to the max! Good play youse. :thumbsup:');
        }
        voteReqCount++;
      }

      function snag () {
        if (snagReqCount === 0) {
          api.curate();
          api.sendChat(':dash::heart:');
        }

        snagReqCount++;
      }
    // </action methods>

    // <subscription methods>
      function checkCommands (data) {
        for (var i = 0; i < chatCommands.length; i++) {
          if (data.message.trim() ===  chatCommands[i].trigger) {
            chatCommands[i].action(data);
            return;
          } 
        }     
      }

      function songChange () {
        voteReqCount = 0;
        snagReqCount = 0;
        maxMsgSent = false;
      }
    // </subscription methods>

    // subscriptions
    api.on(api.CHAT, checkCommands);
    api.on(api.DJ_ADVANCE, songChange);
  }
  
  var skitty = new Bot(API, [ Skitty ]);
})();
