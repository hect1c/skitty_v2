'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * SongPlay Schema
 */
var SongPlaySchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	format: {
		type: Number,
		trim: true
	},
	author: {
		type: String,
		trim: true
	},
	cid: {
		type: String
	},
	duration: {
		type: Number
	},
	id: {
		type: String
	},
	djId: {
		type: String
	},
	earned: {
		type: String
	},
	startTime: {
		type: Date
	},
	users: {
		type: [Schema.Types.Mixed]
	},
	woots: {
		type: [Schema.Types.Mixed]
	},
	mehs: {
		type: [Schema.Types.Mixed]
	},
	grabs: {
		type: [Schema.Types.Mixed]
	}

});

mongoose.model('SongPlay', SongPlaySchema);