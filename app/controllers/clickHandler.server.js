'use strict';

var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var Book = require('../models/books.js');

function ClickHandler() {

	this.addDefault = () => {
		User.find({}, (err, user) => {
			// console.log('default user');
			// console.log(user);
			if (err) throw err;
			if (user.length === 0) {
				var defaultUser = new User({
					email: 'abc@cba.com',
					password: 'abc'
				});
				defaultUser.save((err, data) => {
					if (err) throw err;
					// console.log('default user saved!');
					// console.log(data);
				});
			}
		});
		Book.find({}, (err, book) => {
			console.log('default book');
			console.log(book);
			if (err) throw err;
			if (book.length === 0) {
				var defaultBook = new Book({
					uid: "58e9587d0cc136250e0e3d08",
					bid: "ZbBOAAAAMAAJ",
					title: "Tarzan of the Apes",
					thumbnail: "http://books.google.com/books/content?id=ZbBOAAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
					isRequest: false,
					isAccept: false,
					lendee: ""
				});
				defaultBook.save((err, data) => {
					if (err) throw err;
					console.log('default book saved!');
					console.log(data);
				});
			}
		});
	}

	this.update = (req, res) => {
		console.log(req.body);
		// var name, email, city, state;
		User.findOneAndUpdate(
			{
				_id: req.body.id
			},
			{
				$set:
				{
					name: req.body.name,
					city: req.body.city,
					state: req.body.state
				}
			},
			{ new: true },
			(err, user) => {
				if (err) throw err;
				console.log(user);
				res.json({ user: user });
			}
		);
	}

	this.addBook = (req, res) => {
		console.log('addBook');
		console.log(req.body);

		// req.on('data', body => {
		// 	console.log('addBook req.on data');
		// 	var data = JSON.parse(body);
		// 	console.log(data);
		// 	res.end()
		res.json({
			_id: 'a1c2g3ghr4h5jeq6od7',
			title: 'The Foobars',
			isRequest: false,
			isAccept: false,
			lendee: ''
		});
		// });

	}

	this.getAllBooks = (req, res) => {
		console.log('getAllBooks');
		Books.find().exec((err, data) => {
			if (err) throw err;
			res.json(data);
		});
	}

	this.requestBook = (req, res) => {
		console.log('requestBook');
		req.on('data', body => {
			var data = JSON.parse(body);
			console.log(data);
		});
	}

	this.getPolls = (req, res) => {
		var id = req.user.id;
		Poll
			.find()
			.exec((err, data) => {
				if (err) throw err;
				// console.log('getUserPolls');
				var polls = data.filter(poll => {
					if (poll.uid.toString() === id) {
						return poll;
					}
				});
				res.json(polls);
			});
	}

	this.addPoll = (req, res) => {
		req.on('data', function (body) {

			var data = JSON.parse(body);

			Poll.find({ name: data.name, uid: data.uid }, (err, poll) => {
				if (err) throw err;

				if (poll.length) {
					// console.log('sending json');
					res.json({ isExists: true, isSaved: false });
				} else {
					var newPoll = new Poll(data);

					// Saving it to the database.
					newPoll.save(function (err, data) {
						if (err) {
							// console.log ('Error on save!');
							res.json({ isExists: false, isSaved: false });
						}
						// console.log('data saved');
						res.json({ isExists: false, isSaved: true, poll: data });
					});
				}
			});
		});
	}

	this.getPoll = (req, res) => {
		// console.log('getPoll');
		Poll
			.findOne({ '_id': req.params.id })
			.exec((err, poll) => {
				if (err) throw err;
				res.json(poll)
			});
	}

	this.takePoll = (req, res) => {
		// console.log('editPoll');
		// console.log(req.params.id);
		req.on('data', function (body) {

			var data = JSON.parse(body);

			Poll
				.find({
					'_id': data.id,
					'name': data.name
				})
				.exec((err, poll) => {
					if (err) throw err;
					// console.log('takePoll exec poll');
					var ret = poll[0];
					// console.log(ret.isAuthReq);
					// res.json(poll);
					if (ret.isAuthReq) {
						res.json({ message: 'Not Authorized' })
					} else {
						Poll
							.findOneAndUpdate({
								'_id': data.id,
								'name': data.name,
								'list.key': data.key
							},
							{
								$inc: { 'list.$.value': 1 }
							},
							// get the update poll
							{ new: true }
							)
							.exec((err, poll) => {
								if (err) throw err;
								res.json(poll);
							});
					}
				})
		});
	}

	this.takeAuthPoll = (req, res) => {
		// console.log('takeAuthPoll');
		// console.log(req.user);
		req.on('data', function (body) {

			var data = JSON.parse(body);
			// console.log('takePoll data');
			// console.log(data);

			Poll
				.findOneAndUpdate({
					'_id': data.id,
					'name': data.name,
					'list.key': data.key
				},
				{
					$inc: { 'list.$.value': 1 },
					$push: { voters: data.voter }
				},
				// get the update poll
				{ new: true }
				)
				.exec((err, poll) => {
					if (err) throw err;
					res.json(poll);
				});
		});
	}

	this.editPoll = (req, res) => {
		console.log('editPoll');
		req.on('data', body => {

			var data = JSON.parse(body);

			Poll
				.update({
					'_id': req.params.poll,
					'name': data.name
				},
				{ $push: { list: { key: data.key, value: data.value } } }
				)
				.exec((err, poll) => {
					if (err) throw err;
					res.json(poll);
				});
		});
	}

	this.delPoll = (req, res) => {
		// console.log('del getPoll');
		Poll
			.findByIdAndRemove(req.params.poll)
			.exec((err, poll) => {
				if (err) throw err;
				res.json(poll)
			});
	}

}

module.exports = ClickHandler;
