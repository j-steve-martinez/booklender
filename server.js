'use strict';
// mongo ds149998.mlab.com:49998/vote-machine -u <dbuser> -p <dbpassword>
// mongodb://<dbuser>:<dbpassword>@ds149998.mlab.com:49998/vote-machine
// https://vote-machine-jsm.herokuapp.com/
// https://git.heroku.com/vote-machine-jsm.git

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var sessionMongo = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(sessionMongo);
var bodyParser = require('body-parser');
var Primus = require('primus');

var app = express();
var server = require('http').createServer(app);
var primus = new Primus(server);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

if (process.env.NODE_ENV === 'development') {
	require('dotenv').load();
}

require('./app/config/passport')(passport);

// Create a new MongoDBStore
var store = new MongoDBStore(
	{
		uri: process.env.MONGO_URI,
		collection: 'mySessions'
	});

// Catch errors
store.on('error', function(error) {
	assert.ifError(error);
	assert.ok(false);
});

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/client/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/client/common'));
app.use('/views', express.static(process.cwd() + '/app/client/views'));

app.use(session({
	secret: 'secretSauce',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	},
	store: store,
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport, primus);

var port = process.env.PORT || 8080;
server.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
