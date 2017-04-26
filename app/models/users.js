'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	name: String,
	email: String,
	password: {
		type: String,
		required: true,
		minlength: 1
	},
	city: String,
	state: String,
});

module.exports = mongoose.model('User', User);
