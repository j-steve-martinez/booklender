'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    uid: String,
    bid: String,
    title: String,
    thumbnail: String,
    isRequest: Boolean,
    isAccept: Boolean,
    lendee: String 
});

module.exports = mongoose.model('Book', Book);
