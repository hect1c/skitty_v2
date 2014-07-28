'use strict';

  /**
   * Stats is a RESTful api for retrieving statistics from the tt data
   */
  function TurntableStats (http, db) {
    var self = this;

    http.get('/tt/dj/:name/summary', function(req, res) {
      db.plays.find({ djName: req.params.name }, function(err, plays) {
        var body;

        function getTotal (property)  {
          var count = 0;

          for (var i in plays) {
            count += plays[i][property];
          }

          return count;
        }

        function getAverage (property) {
          var total = getTotal(property);

          return (total / plays.length);
        }

        function findHighest (property) {
          var high = 0;

          for (var i in plays) {
            if (plays[i].roomInfo.listeners > high) {
              high = plays[i].roomInfo.listeners;
            }
          }

          return high;
        }

        if (err || !plays) {
          body = err;
        } else {
          body = {
            totalPlays: plays.length,
            totalLikes: getTotal('likes'),
            totalHearts: getTotal('hearts'),
            totalLames: getTotal('lames'),
            averagePointsPerSong: getAverage('likes'),
            averageHeartsPerSong: getAverage('hearts'),
            averageLamesPerSong: getAverage('lames'),
            averageScore: Math.round(getAverage('score') * 100),
            peekListeners: findHighest()
          };

          body = JSON.stringify(body);
        }

        res.setHeader('Content-Type', 'text/json');
        res.send(body);
      });
    });

    http.get('/tt/dj/:name/plays', function(req, res) {
      db.plays.find({ djName: req.params.name }, function(err, plays) {
        var body;

        if (err || !plays) {
          body = err;
        } else {
          body = plays;
          body = JSON.stringify(body);
        }

        res.setHeader('Content-Type', 'text/json');
        res.send(body);
      });
    });

    http.get('/tt/user/id/:id/snags', function(req, res){
      db.hearts.find({ userId: req.params.id }, function(err, hearts) {
        var body;

        if (err || !hearts) {
          body = err;
        } else {
          body = JSON.stringify(hearts);
        }

        res.setHeader('Content-Type', 'text/json');
        res.send(body);
      });
    });
  }

  exports.TurntableStats = TurntableStats;