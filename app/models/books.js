'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    uid: {type: String, default: ''},
    bid: {type: String, default: ''},
    title: {type: String, default: ''},
    thumbnail: {type: String, default: ''},
    isRequest: {type: Boolean, default: false},
    isAccept: {type: Boolean, default: false},
    lendee: {type: String, default: ''} 
});

module.exports = mongoose.model('Book', Book);
