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
      console.dir('==logSongPlay==');
      var songPlay = new SongPlay(song);
      songPlay.save(function(err, song){
        if (err) return console.error('Song save failed: ' + err);
      });
    };

    self.qGetAllPlays = function () {
      console.dir('==qGetAllPlays==');
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
      console.dir('==qGetDjPlaysById==');
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
      console.dir('==qGetAllBySongsById==');
      var dfr = q.defer();

      SongPlay.find({ id: id }, function(err, plays) {
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
      console.dir('==qGetAllByArtistName==');
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