'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
    uid: String,
    ownerId: String,
    bookId: String,
    title: String,
    thumbnail: String,
    isOnLoan: Boolean,
    lendee: String 
});

module.exports = mongoose.model('Book', Book);
