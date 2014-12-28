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
     * @param  {Function} callback
     */
    logSongPlay: function(song, callback) {
        Songs.insert(song, callback);
    },
    /**
     * Extends find one method
     * @param  {Object}   doc      Cursor to find
     * @param  {Function} callback
     */
    skittyDbFindOne: function(doc) {
        return Songs.findOne(doc);
    },
    /**
     * Get All Plays
     * @return {object} All total plays
     */
    getAllPlays: function() {
        //instantiate Q package
        var dfr = Q.defer();

        var cursor = Songs.find({});

        var songs = cursor.fetch();
        count = cursor.count();

        if (count > 0) {
            dfr.resolve(songs);
        } else {
            dfr.resolve(null);
        }

        return dfr.promise;
    },
    /**
     * Get all songs by Id
     * @param  {int} id Id of Song
     * @return {object} All Plays by id (plays || null)
     */
    getAllSongsById: function(id) {
        var dfr = Q.defer();

        var cursor = Songs.find({
            id: id
        });

        var song = cursor.fetch(),
            count = cursor.count();

        if (count > 0) {
            dfr.resolve(song);
        } else {
            dfr.resolve(null);
        }

        return dfr.promise;
    },
    /**
     * Get All Plays By DJ
     * @param  {int} djId Id of dj
     * @return {object}      All songs played by dj
     */
    getDjPlaysById: function(djId) {
        var dfr = Q.defer();

        var cursor = Songs.find({
            djId: djId
        });

        var song = cursor.fetch(),
            count = cursor.count();

        if (count > 0) {
            dfr.resolve(song);
        } else {
            dfr.resolve(null);
        }

        return dfr.promise;
    },
    /**
     * Get all Plays by artist name
     * @param  {string} artistName Name of artist to search on
     * @return {object}            All songs with artist name
     */
    getAllPlaysByArtistName: function(artistName) {
        var dfr = Q.defer();

        var cursor = Songs.find({
            author: artistName
        });

        var song = cursor.fetch(),
            count = cursor.count();

        if (count > 0) {
            dfr.resolve(song);
        } else {
            dfr.resolve(null);
        }

        return dfr.promise;
    }
}
