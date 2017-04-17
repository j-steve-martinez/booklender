'use strict';
// https://www.googleapis.com/books/v1/volumes?q=tarzan&maxResults=1&printType=books&projection=lite
var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var index = path + '/public/index.html';

module.exports = function (app, passport, primus) {

	function isLoggedIn(req, res, next) {
		// console.log('starting isAuthenticated');
		// console.log('req.session');
		// console.log(req.session);
		if (req.isAuthenticated()) {
			// console.log('isAuthenticated true');
			return next();
		} else {
			// console.log('isAuthenticated false');
			// console.log(req.url);
			res.json({ id: false });
		}
	}

	var clickHandler = new ClickHandler();
	clickHandler.addDefault();

	app.route('/')
		.get(function (req, res) {
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

	app.route('/logout')
		.post(isLoggedIn, (req, res) => {
			req.logout();
			res.status(200)
			res.json({ success: 'Logged out!' });
		})

	// console.log(primus);
	primus.on('connection', function connection(spark) {
		// console.log('new connection ' + spark.id);
		// primus.write('data');

		/**
		 * Wait for all data to be received from the client
		 */
		spark.on('data', function received(data) {
			var sourceId = spark.id;
			// console.log('source id');
			// console.log(sourceId);
			if (typeof data === 'object') {
				// console.log(spark.id, 'received data:');
				// console.log(typeof data);
				// console.log(data);
				/**
				 * Send the message to all clients
				 */
				primus.forEach(function (spark, id, connections) {

					if (sourceId !== spark.id && typeof data !== 'string') {
						// console.log('sending to ' + spark.id + ' this data:');
						// console.log(data);

						spark.write(data);
					}

				});
			}
		});
	});

	app.route('/api/books')
		.get(isLoggedIn, clickHandler.getAllBooks)
		.post(isLoggedIn, clickHandler.addBook)
		.put(isLoggedIn, clickHandler.editBook)
		.delete(isLoggedIn, clickHandler.deleteBook)

};