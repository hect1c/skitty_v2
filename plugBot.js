(function () {
  // TESTING
  var phantom = require('node-phantom-simple');
  
  phantom.create(function(err,ph) {
    ph.addCookie({
      'name': 'usr',
      'value': 'f9jxkL5LEn+FbBxI67Ff9tqs2gw=?_expires=STE0MDE2NzY1MjMKLg==&user_id=Uyc1MjkzZTE2NjNlMDgzZTFkMDc4YzkxYzInCnAxCi4=&v=STIKLg==',
      'domain': '.plug.dj',
      'path': '/',
      'httpOnly': true,
      'secure': false,
      'expires': '01/06/2014 10:35 PM' 
    });

    return ph.createPage(function(err, page) {
      // <debug>
        page.onNavigationRequested = function (url, type, willNavigate, main) {
          console.log(arguments);
        };
        
        page.onConsoleMessage = function (msg, lineNum, sourceId) {
          console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
        };

        page.onError = function(msg, trace) {
          var msgStack = ['ERROR: ' + msg];
          if (trace && trace.length) {
            msgStack.push('TRACE:');
            trace.forEach(function(t) {
              msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
            });
          }
          console.error(msgStack.join('\n'));
        };
      // </debug>

      return page.open("http://plug.dj/coding-soundtrack-lounge/", function(err,status) {
        console.log('connection: ' + status);

        // wait for plug to load before doing anything
        setTimeout(function() {
          // *try* to inject skitty script - doesnt seem to work tho
          var injected = page.injectJs('skitty.js');
          
          // check to see if API is even available
          page.evaluate(function() {
            return API;
          }, function(err, result) {         
            // console.log(result || err);
          });
        }, 15000);
      })
    })
  });
}());

