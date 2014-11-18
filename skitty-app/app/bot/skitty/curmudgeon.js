'use strict';

  // for all the dick-ish bot commands XP
  function Curmudgeon (model) {
    var self = this,
        api = {},
        core = {};

    // This was very shamelelessly stolen from J Miller's webpage at
    // http://ermahgerd.jmillerdesign.com/
    function translate (word) {
        // Don't translate short words
        if (word.length === 1) {
            return word;
        }

        // Handle specific words
        switch (word) {
            case 'AWESOME':         return 'ERSUM';
            case 'BANANA':          return 'BERNERNER';
            case 'BAYOU':           return 'BERU';
            case 'FAVORITE':
            case 'FAVOURITE':       return 'FRAVRIT';
            case 'GOOSEBUMPS':      return 'GERSBERMS';
            case 'LONG':            return 'LERNG';
            case 'MY':              return 'MAH';
            case 'THE':             return 'DA';
            case 'THEY':            return 'DEY';
            case 'WE\'RE':          return 'WER';
            case 'YOU':             return 'U';
            case 'YOU\'RE':         return 'YER';
        }

        // Before translating, keep a reference of the original word
        var originalWord = word;

        // Drop vowel from end of words
        if (originalWord.length > 2) {  // Keep it for short words, like "WE"
            word = word.replace(/[AEIOU]$/, '');
        }

        // Reduce duplicate letters
        word = word.replace(/[^\w\s]|(.)(?=\1)/gi, '');

        // Reduce adjacent vowels to one
        word = word.replace(/[AEIOUY]{2,}/g, 'E');  // TODO: Keep Y as first letter

        // DOWN -> DERN
        word = word.replace(/OW/g, 'ER');

        // PANCAKES -> PERNKERKS
        word = word.replace(/AKES/g, 'ERKS');

        // The meat and potatoes: replace vowels with ER
        word = word.replace(/[AEIOUY]/g, 'ER');     // TODO: Keep Y as first letter

        // OH -> ER
        word = word.replace(/ERH/g, 'ER');

        // MY -> MAH
        word = word.replace(/MER/g, 'MAH');

        // FALLING -> FALERNG -> FERLIN
        word = word.replace('ERNG', 'IN');

        // POOPED -> PERPERD -> PERPED
        word = word.replace('ERPERD', 'ERPED');

        // MEME -> MAHM -> MERM
        word = word.replace('MAHM', 'MERM');

        // Keep Y as first character
        // YES -> ERS -> YERS
        if (originalWord.charAt(0) === 'Y') {
            word = 'Y' + word;
        }

        // Reduce duplicate letters
        word = word.replace(/[^\w\s]|(.)(?=\1)/gi, '');

        // YELLOW -> YERLER -> YERLO
        if ((originalWord.substr(-3) === 'LOW') && (word.substr(-3) === 'LER')) {
            word = word.substr(0, word.length - 3) + 'LO';
        }

        return word;
    }

    function ermify (data) {
      var werdsErer = data.message.substr(4, data.message.length).trim().toUpperCase().split(' ');

            for (var i in werdsErer) {
                werdsErer[i] = translate(werdsErer[i]);
            }

            var msg = werdsErer.toString();
      msg = msg.replace(/,/g, ' ');

            core.showMessage(msg);
    }

    function generateInsult (data){
      var wordBank = model.resources.insultGenerator,
          a = wordBank.A[Math.floor(Math.random()*wordBank.A.length)],
          b = wordBank.B[Math.floor(Math.random()*wordBank.B.length)],
          c = wordBank.C[Math.floor(Math.random()*wordBank.C.length)],
          d = wordBank.D[Math.floor(Math.random()*wordBank.D.length)],
          e = wordBank.E[Math.floor(Math.random()*wordBank.E.length)],
          f = wordBank.F[Math.floor(Math.random()*wordBank.F.length)];

      // if (name == undefined){
        var name = 'You';
      // }

      var msg = model.resources.insultGenerator.madlib.replace('{user}', name).replace('{a}', a).replace('{b}', b).replace('{c}', c).replace('{d}', d).replace('{e}', e).replace('{f}', f);

      core.showMessage(msg);
    }


     var chatCommands = [
          { trigger: 'rude',              action: function(data) { core.showMessage(model.resources.generic); } },
          { trigger: 'do your best!',     wildCard: true, action: generateInsult },
          { trigger: 'fuck you s\'kitty', wildCard: true, action: function(data) { core.showMessage(model.resources.fuckYou, data); } },
          { trigger: 'fuck you skitty',   wildCard: true, action: function(data) { core.showMessage(model.resources.fuckYou, data); } },
          { trigger: 'woah',              wildCard: true, action: function(data) { core.showMessage(model.resources.whoa); } },
          { trigger: 'whoa',              wildCard: true, action: function(data) { core.showMessage(model.resources.whoa); } },
          { trigger: 'exactly',           wildCard: true, action: function(data) { core.showMessage(model.resources.exactly); } },
          { trigger: 'erm',               action: ermify }
      ];

    // add subscriptions and init code here
    self.init = function (plugApi, pluginCore) {
      api = plugApi;
      core = pluginCore;

      if (core.isFirstConnect()) {
        api.on('chat', core.checkCommands.bind(core, chatCommands));
      }
    };
  }

  exports.Curmudgeon = Curmudgeon;
