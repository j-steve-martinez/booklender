'use strict';

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		// console.log('seralizeUser');
		// console.log(user);
		done(null, user);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			// console.log('deserializeUser');
			// console.log(user);
			done(err, user);
		});
	});

	passport.use('signup', new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		function (email, password, done) {
			// console.log('passport signup');
			// console.log(email);
			// console.log(password);

			User.findOne({ email: email }, function (err, user) {
				// console.log('new user');
				// console.log(user);
				if (err) { console.log('err'); return done(err); }
				if (user === null) {
					var newUser = new User({
						email: email,
						password: password
					});
					newUser.save((err, data) => {
						if (err) throw err;
						// console.log('new user saved!');
						// console.log(data);
						return done(null, data);
					});
				}
				else {
					return done(null, false);
				}
			});
		})
	);

	passport.use('login', new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		function (email, password, done) {
			User.findOne({ email: email, password: password }, function (err, user) {
				if (err) { console.log('err'); return done(err); }
				if (!user) { return done(null, false); }
				return done(null, user);
			});
		}
	));
};
