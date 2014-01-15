(function () {
  // local dependencies
  var q = require("q"),
      mongojs = require("mongojs");

  // promise-based interface for accessing plug statistics
  function StatsDb (model) {
    var self = this;

    self.logSongPlay = function (song) {
      model.db.songPlays.save(song, function (err, saved) {
        if (err || !saved) {
          console.log("Song save failed: " + err);
        }
      });
    };

    self.qGetAllPlays = function () {
      var dfr = q.defer();
      
      model.db.songPlays.find(function(err, plays) {
        if (err || !plays) {
          dfr.reject(err);
        } else { 
          if (plays.length > 0) {     
            dfr.resolve(plays);
          } else {
            dfr.resolve(null);
          }             
        }         
      });
      
      return dfr.promise;
    };
    
    self.qGetAllBySongName = function (songName) {
      var dfr = q.defer();
      
      model.db.songPlays.find({ title: songName }, function(err, plays) {
        if (err || !plays) {
          dfr.reject(err);
        } else { 
          if (plays.length > 0) {     
            dfr.resolve(plays);
          } else {
            dfr.resolve(null);
          }             
        }         
      });
      
      return dfr.promise;
    };
    
    self.qGetAllByArtistName = function (artistName) {
      var dfr = q.defer();
      
      model.db.songPlays.find({ author: artistName }, function(err, plays) {
        if (err || !plays) {
          dfr.reject(err);
        } else { 
          if (plays.length > 0) {     
            dfr.resolve(plays);
          } else {
            dfr.resolve(null);
          }             
        }            
      });
      
      return dfr.promise;
    }


    /**
     * Find first/last playtime of a song by name
     */
    self.qFindFirstLastPlayByName = function (songName, sort) {
      var dfr = q.defer(),
          dataHandler = function(err, plays) {
            if (err || !plays) {
              dfr.reject(err);
            } else { 
              if (plays.length > 0) {     
                dfr.resolve(plays[0]);
              } else {
                dfr.resolve(null);
              }             
            }  
          };

      // query database
      model.db.songPlays
        .find({ title: songName })
        .limit(2)
        .sort({ startTime: sort }, dataHandler);
      
      return dfr.promise;
    }
  }

  exports.StatsDb = StatsDb;
}());