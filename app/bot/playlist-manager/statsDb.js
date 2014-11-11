'use strict';
  //@todo Write models for this module
  // local dependencies
  var q = require('q'),
      mongoose = require('mongoose'),
      SongPlayModel = require('../../models/song-play.server.model.js'),
      SongPlay = mongoose.model('SongPlay');

  // promise-based interface for accessing plug statistics
  function StatsDb (model) {
    var self = this;

    self.logSongPlay = function (song) {
      var songPlay = new SongPlay(song);
      songPlay.save(function(err, song){
        if (err) return console.error('Song save failed: ' + err);
      });
    };

    self.qGetAllPlays = function () {
      var dfr = q.defer();

      SongPlay.find(function(err, plays) {
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

      SongPlay.find({ djId: djId }, function(err, plays) {
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
      // console.dir(id);
      SongPlay.find({ id: id }, function(err, plays) {
        // console.dir( plays );
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
      // console.dir( dfr.promise );
      return dfr.promise;
    };

    self.qGetAllByArtistName = function (artistName) {
      var dfr = q.defer();

      SongPlay.find({ author: artistName }, function(err, plays) {
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
  }

  exports.StatsDb = StatsDb;