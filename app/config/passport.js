'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		console.log('seralizeUser');
		console.log(user);
		done(null, user);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			console.log('deserializeUser');
			console.log(user);
			done(err, user);
		});
	});

	passport.use('signup', new LocalStrategy(
		// passport.use(new LocalStrategy(
		{
			// by new, local strategy uses username and password, we will override with email
			usernameField: 'email',
			passwordField: 'password',
			// passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		},
		function (email, password, done) {
			console.log('passport signup');
			console.log(email);
			console.log(password);
			// return done(null, false)
			User.findOne({ email: email }, function (err, user) {
				console.log('new user');
				console.log(user);
				// if (err) throw err;
				if (err) { console.log('err'); return done(err); }
				if (user === null) {
					var newUser = new User({
						email: email,
						password: password
					});
					newUser.save((err, data) => {
						if (err) throw err;
						console.log('new user saved!');
						console.log(data);
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
			// passReqToCallback: true
			// session: false
		},
		function (email, password, done) {
			User.findOne({ email: email, password: password }, function (err, user) {
				if (err) { console.log('err'); return done(err); }
				if (!user) { return done(null, false); }
				// if (!user.verifyPassword(password)) { return done(null, false); }
				return done(null, user);
			});
		}
	));

	passport.use(new TwitterStrategy({
		consumerKey: configAuth.twitterAuth.clientID,
		consumerSecret: configAuth.twitterAuth.clientSecret,
		callbackURL: configAuth.twitterAuth.callbackURL
	},
		function (token, tokenSecret, profile, done) {
			User.findOne({ 'data.id': profile.id }, function (err, user) {
				// console.log('user');
				// console.log(user);
				if (err) {
					return done(err);
				}

				if (user) {
					// console.log('Passport user');
					// console.log(user);
					return done(null, user);
				} else {
					var newUser = new User();
					// console.log('new user profile twitter');
					// console.log(profile.provider);
					newUser.provider = profile.provider;
					newUser.username = profile.username;
					newUser.id = newUser._id;
					newUser.uid = profile.provider + "_" + profile.id;
					newUser.data.id = profile.id;
					newUser.data.username = profile.username;
					newUser.data.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		}
	));

	passport.use(new GitHubStrategy({
		clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL
	},
		function (token, refreshToken, profile, done) {
			process.nextTick(function () {
				User.findOne({ 'data.id': profile.id }, function (err, user) {
					if (err) {
						return done(err);
					}

					if (user) {
						// console.log('Passport user');
						// console.log(user);
						return done(null, user);
					} else {
						var newUser = new User();
						// console.log('new user profile github');
						// console.log(profile.provider);
						newUser.provider = profile.provider;
						newUser.username = profile.username;
						newUser.id = newUser._id;
						newUser.uid = profile.provider + "_" + profile.id;
						newUser.data.id = profile.id;
						newUser.data.username = profile.username;
						newUser.data.displayName = profile.displayName;

						newUser.save(function (err) {
							if (err) {
								throw err;
							}

							return done(null, newUser);
						});
					}
				});
			});
		}));
};
