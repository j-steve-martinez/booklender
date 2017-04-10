'use strict';
// https://www.googleapis.com/books/v1/volumes?q=tarzan&maxResults=1&printType=books&projection=lite
var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var index = path + '/public/index.html';

module.exports = function (app, passport, primus) {

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

	app.route('/signup')
		.post((req, res, next) => {

			// console.log('signup req');
			// console.log(req);
			// console.log(req.body);
			// console.log(req.body.email);
			// console.log(req.body.password);

			passport.authenticate('signup', function (err, user) {

				// console.log('signup user');
				// console.log(user);
				// console.log(req.body);
				// console.log('err');
				// console.log(err);

				if (err) { return next(err); }
				if (!user) { return res.status(401).send({ "error": "Email already in use!" }); }
				req.logIn(user, function (err) {
					// console.log('logIn user');
					// console.log(user);
					if (err) { return res.status(401).send({ "ok": false }); }
					return res.send({ user });
				});

			})(req, res, next);
		});

	app.route('/login')
		.post((req, res, next) => {

			// console.log('login req');
			// console.log(req);
			// console.log(req.body);
			// console.log(req.body.email);
			// console.log(req.body.password);

			passport.authenticate('login', function (err, user) {

				// console.log('login user');
				// console.log(user);
				// console.log(req.body);

				if (err) { return next(err); }
				if (!user) { return res.status(401).send({ "ok": false }); }
				req.logIn(user, function (err) {
					if (err) { return res.status(401).send({ "ok": false }); }
					// return res.send({ "ok": true });
					return res.send({ user });
				});

			})(req, res, next);
		})

	app.route('/update')
		.post(isLoggedIn, clickHandler.update)

	// console.log(primus);
	primus.on('connection', function connection(spark) {
		// console.log('new connection ' + spark.id);
		// primus.write('data');

		/**
		 * Wait for all data to be received from the client
		 */
		spark.on('data', function received(data) {
			var sourceId = spark.id;
			if (typeof data === 'object') {
				console.log(spark.id, 'received data:');
				console.log(typeof data);
				console.log(data);
				/**
				 * Send the message to all clients
				 */
				primus.forEach(function (spark, id, connections) {

					if (sourceId !== spark.id) {
						console.log('sending ' + data + ' to ' + spark.id);

						spark.write(data);
					}

				});
			}
		});
	});

	app.route('/api/books')
		.get(isLoggedIn, clickHandler.getAllBooks)
		.post(isLoggedIn, clickHandler.addBook)
		.put(isLoggedIn, clickHandler.requestBook)

	// add, get, edit, delete the user poll data
	// must be authenticated
	// app.route('/api/:id/:poll')
	// 	.get(isLoggedIn, clickHandler.getPolls)
	// 	.put(isLoggedIn, clickHandler.editPoll)
	// 	.post(isLoggedIn, clickHandler.addPoll)
	// 	.patch(isLoggedIn, clickHandler.takeAuthPoll)
	// 	.delete(isLoggedIn, clickHandler.delPoll)

	// exports.logout = (req, res) => {
	// 	req.logout();
	// 	return res
	// 		.status(200)
	// 		.json({ success: 'Logged out!' });
	// }
};