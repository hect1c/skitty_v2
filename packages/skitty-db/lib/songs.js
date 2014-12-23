//Instantiate new mongo collection
Songs = new Mongo.Collection('songs');

var Schemas = {};

Schemas.Song = new SimpleSchema({
    author: {
        type: String
    },
    format: {
        type: Number
    },
    cid: {
        type: String
    },
    duration: {
        type: Number
    },
    title: {
        type: String
    },
    id: {
        type: String
    },
    djId: {
        type: String
    },
    earned: {
        type: String,
        optional: true
    },
    startTime: {
        type: Date
    },
    users: {
        type: [Object],
        optional: true,
        blackbox: true //no validation on properties of object
    },
    woots: {
        type: [Object],
        optional: true,
        blackbox: true //no validation on properties of object
    },
    mehs: {
        type: [Object],
        blackbox: true, //no validation on properties of object
        optional: true
    },
    grabs: {
        type: [Object],
        blackbox: true, //no validation on properties of object
        optional: true
    }
});

Songs.attachSchema(Schemas.Song);