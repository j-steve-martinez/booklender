'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var index = path + '/public/index.html';

module.exports = function (app, passport) {

	function isLoggedIn(req, res, next) {
		console.log('starting isAuthenticated');
		console.log('req.session');
		console.log(req.session);
		if (req.isAuthenticated()) {
			console.log('isAuthenticated true');
			return next();
		} else {
			console.log('isAuthenticated false');
			console.log(req.url);
			res.json({ id: false });
		}
	}

	var clickHandler = new ClickHandler();
	clickHandler.addDefault();

	app.route('/')
		.get(function (req, res) {
			// console.log(req.params);
			res.sendFile(index);
		});



	// app.route('/login')
	// 	.get(function (req, res) {
	// 		res.sendFile(path + '/public/login.html');
	// 	});

	// app.route('/logout')
	// 	.get(function (req, res) {
	// 		req.logout();
	// 		res.redirect('/');
	// 	});

	// get and take a poll
	// app.route('/api/poll/:id')
	// 	.get(clickHandler.getPoll)
	// 	.put(clickHandler.takePoll)

	// get all polls
	// app.route('/api/allPolls')
	// 	.get(clickHandler.getAllPolls)

	// get user info
	// app.route('/api/:id')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.json(req.user)
	// 	});

	// app.route('/auth/github')
	// 	.get(passport.authenticate('github'));

	// app.route('/auth/github/callback')
	// 	.get(passport.authenticate('github', {
	// 		successRedirect: '/',
	// 		failureRedirect: '/'
	// 	}));

	// app.route('/auth/twitter')
	// 	.get(passport.authenticate('twitter'));

	// app.route('/auth/twitter/callback')
	// 	.get(passport.authenticate('twitter', {
	// 		successRedirect: '/',
	// 		failureRedirect: '/'
	// 	}));

	// app.route('/signup')
	// .post(passport.authenticate('local'));


	app.route('/signup')
		.post((req, res, next) => {

			console.log('signup req');
			// console.log(req);
			console.log(req.body);
			console.log(req.body.email);
			console.log(req.body.password);

			passport.authenticate('signup', function (err, user) {

				console.log('signup user');
				console.log(user);
				console.log(req.body);

				if (err) { return next(err); }
				if (!user) { return res.status(401).send({ "ok": false }); }
				req.logIn(user, function (err) {
					if (err) { return res.status(401).send({ "ok": false }); }
					// return res.send({ "ok": true });
					return res.send({ user });
				});

			})(req, res, next);
		})
		.get(isLoggedIn, (req, res) => {
			console.log('signup .get()');
		});


	app.route('/login')
		.post((req, res, next) => {

			console.log('login req');
			// console.log(req);
			console.log(req.body);
			console.log(req.body.email);
			console.log(req.body.password);

			passport.authenticate('login', function (err, user) {

				console.log('login user');
				console.log(user);
				console.log(req.body);

				if (err) { return next(err); }
				if (!user) { return res.status(401).send({ "ok": false }); }
				req.logIn(user, function (err) {
					if (err) { return res.status(401).send({ "ok": false }); }
					// return res.send({ "ok": true });
					return res.send({ user });
				});

			})(req, res, next);
		})

		.get(isLoggedIn, (req, res) => {
			console.log('login get');
			// res.json({status: 'ok'});
			res.end();
		});

	// app.route('/auth/local/callback')
	// 	.get(passport.authenticate('local', {
	// 		successRedirect: '/',
	// 		failureRedirect: '/'
	// 	}));

	// add, get, edit, delete the user poll data
	// must be authenticated
	// app.route('/api/:id/:poll')
	// 	.get(isLoggedIn, clickHandler.getPolls)
	// 	.put(isLoggedIn, clickHandler.editPoll)
	// 	.post(isLoggedIn, clickHandler.addPoll)
	// 	.patch(isLoggedIn, clickHandler.takeAuthPoll)
	// 	.delete(isLoggedIn, clickHandler.delPoll)
};
