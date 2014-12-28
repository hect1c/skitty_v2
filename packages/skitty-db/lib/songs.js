//Instantiate new mongo collection
Songs = new Mongo.Collection('songs');

/**
 * @todo  Fix issue with Collection 2 package
 *        Even though blackbox is set to true
 *        still validating nested objects
 */
// var Schemas = {};

// Schemas.Song = new SimpleSchema({
//     author: {
//         type: String
//     },
//     format: {
//         type: Number
//     },
//     cid: {
//         type: String
//     },
//     duration: {
//         type: Number
//     },
//     title: {
//         type: String
//     },
//     id: {
//         type: String
//     },
//     djId: {
//         type: String
//     },
//     earned: {
//         type: String,
//         optional: true
//     },
//     startTime: {
//         type: Date
//     },
//     users: {
//         type: [Object],
//         optional: true,
//         blackbox: true //no validation on properties of object
//     },
//     woots: {
//         type: [Object],
//         optional: true,
//         blackbox: true //no validation on properties of object
//     },
//     mehs: {
//         type: [Object],
//         optional: true,
//         blackbox: true //no validation on properties of object

//     },
//     grabs: {
//         type: [Object],
//         optional: true,
//         blackbox: true //no validation on properties of object

//     }
// });

// Songs.attachSchema(Schemas.Song);