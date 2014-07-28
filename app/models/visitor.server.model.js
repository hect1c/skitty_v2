'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Visitor Schema
 */
var VisitorSchema = new Schema({
	avatarID : { 
		type: String
	},
	curated : { 
		type: Boolean
	},
	curatorPoints : { 
		type: Number
	},
	dateJoined : { 
		
		type: Date
	},
	djPoints : { 
		type: Number 
	},
	fans : { 
		type: Number 
	},
	id : { 
		type: String
	},
	language : { 
		type: String
	},
	listenerPoints : { 
		type: Number 
	},
	permission : { 
		type: Number 
	},
	status : { 
		type: Number 
	},
	username : { 
		type: String
	},
	vote : { 
		type: Number 
	}
});

mongoose.model('Visitor', VisitorSchema);