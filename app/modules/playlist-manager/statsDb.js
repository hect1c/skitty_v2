'use strict';
  //@todo Write models for this module
  // local dependencies
  var q = require('q'),
      mongoose = require('mongoose');

  // promise-based interface for accessing plug statistics
  function StatsDb (model) {
    var self = this;

    self.logSongPlay = function (song) {
      model.db.songPlays.save(song, function (err, saved) {
        if (err || !saved) {
          console.log('Song save failed: ' + err);
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

    self.qGetDjPlaysById = function (djId) {
      var dfr = q.defer();

      model.db.songPlays.find({ djId: djId }, function(err, plays) {
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

    self.qGetAllBySongsById = function (id) {
      var dfr = q.defer();

      model.db.songPlays.find({ id: id }, function(err, plays) {
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

    self.qFindFirstLastPlayById = function (id, sort) {
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
        .find({ id: id })
        .limit(2)
        .sort({ startTime: sort }, dataHandler);

      return dfr.promise;
    }
  }

  exports.StatsDb = StatsDb;