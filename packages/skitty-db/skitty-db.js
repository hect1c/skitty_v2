/**
 * Skitty DB Manager
 * @type {Object}
 */
SkittyDb = {};

/**
 * Set of methods for Songs collections
 * @type {Object}
 */
SkittyDb.Songs = {
    /**
     * Saves song plays in Songs collections
     * @param  {Object}   song     Current Playing song in room
     * @param  {Function} callback [description]
     */
    logSongPlay: function(song, callback) {
        Songs.insert(song, callback);
    },
    getAllPlays: function() {
        //instantiate Q package
        var dfr = Q.defer();

        Songs.find(function(err, plays) {
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
    },
    /**
     * Get all songs by Id
     * @param  {int} id Id of Song
     * @return {object} All Plays
     */
    getAllSongsById: function(id){
        var dfr = Q.defer();

        Songs.find({ id : id }, {}, function(err, plays){
            if( err || !plays ){
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
    },
    /**
     * Get All Plays By DJ
     * @param  {int} djId Id of dj
     * @return {object}      All songs played by dj
     */
    getDjPlaysById: function(djId){
        var dfr = Q.defer();

        Songs.find({ djId : djId }, {}, function(err, plays){
            if( err || !plays ){
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
    },
    /**
     * Get all Plays by artist name
     * @param  {string} artistName Name of artist to search on
     * @return {object}            All songs with artist name
     */
    getAllPlaysByArtistName: function(artistName){
        var dfr = Q.defer();

        Songs.find({author: artistName}, {}, function(err,plays){
            if( err || !plays ){
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
}
