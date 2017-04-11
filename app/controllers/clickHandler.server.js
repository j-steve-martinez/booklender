'use strict';

var Books = require('google-books-search');
var User = require('../models/users.js');
var Poll = require('../models/polls.js');
var Book = require('../models/books.js');
// var Promise = require('bluebird');


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
			// console.log('default book');
			// console.log(book);
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
		var title, options;

		title = req.body.title;

		options = {
			// field: 'title',
			limit: 1,
			type: 'books',
			lang: 'en',
			// projection: 'lite'
		};

		Books.search(title, options, function (error, results, apiResponse) {
			if (error) {
				// console.log(error);
				throw error;
			} else {
				// resolve(results);
				// console.log(req.session.passport.user._id);
				// console.log(results);
				var myBook = new Book();
				myBook.title = results[0].title;
				myBook.thumbnail = results[0].thumbnail;
				myBook.bid = results[0].id;
				myBook.uid = req.session.passport.user._id
				// console.log(myBook);
				// res.json(myBook);
				//
				Book.find({ _id: myBook._id, title: myBook.title }, (err, book) => {
					if (err) throw err;

					if (book.length) {
						// console.log('sending json');
						res.json({ isExists: true });
					} else {
						// var newPoll = new Poll(data);

						// Saving it to the database.
						myBook.save(function (err, book) {
							if (err) {
								// console.log ('Error on save!');
								res.json({ isError: false });
							}
							// console.log('data saved');
							res.json(book);
						});
					}
				});
				//

			}
		});


	}

	this.getAllBooks = (req, res) => {
		console.log('getAllBooks');
		Book.find().exec((err, data) => {
			if (err) throw err;
			console.log(data);
			res.json(data);
		});
	}

	this.googleBook = (req, res) => {
		// console.log('googleBook');
		// console.log(req.body);

		var title, options;

		title = req.body.title;

		options = {
			// field: 'title',
			limit: 1,
			type: 'books',
			lang: 'en',
			// projection: 'lite'
		};

		Books.search(title, options, function (error, results, apiResponse) {
			if (error) {
				// console.log(error);
				throw error;
			} else {
				// resolve(results);
				// console.log(req.session.passport.user._id);
				// console.log(results);
				var book = new Book();
				book.title = results[0].title;
				book.thumbnail = results[0].thumbnail;
				book.bid = results[0].id;
				book.uid = req.session.passport.user._id
				// console.log(book);
				res.json(book);
			}
		});
	};

	this.requestBook = (req, res) => {
		console.log('requestBook');
		console.log(req.body);
		// console.log(req.on());
		// req.on('data', body => {
		console.log('requestBook on data');
		// var data = JSON.parse(body);
		// console.log(data);
		// console.log(body);
		// });
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

var dracula = {

	"kind": "books#volumes",
	"totalItems": 2939,
	"items": [
		{
			"kind": "books#volume",
			"id": "k39vHp-5VeMC",
			"etag": "gfbZLFUuxF4",
			"selfLink": "https://www.googleapis.com/books/v1/volumes/k39vHp-5VeMC",
			"volumeInfo": {
				"title": "Dracula",
				"subtitle": "A Mystery Story",
				"authors": [
					"Bram Stoker"
				],
				"publishedDate": "1897",
				"readingModes": {
					"text": true,
					"image": true
				},
				"maturityRating": "NOT_MATURE",
				"allowAnonLogging": false,
				"contentVersion": "3.7.5.0.full.3",
				"panelizationSummary": {
					"containsEpubBubbles": false,
					"containsImageBubbles": false
				},
				"imageLinks": {
					"smallThumbnail": "http://books.google.com/books/content?id=k39vHp-5VeMC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
					"thumbnail": "http://books.google.com/books/content?id=k39vHp-5VeMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
				},
				"previewLink": "http://books.google.com/books?id=k39vHp-5VeMC&printsec=frontcover&dq=dracula&hl=&as_pt=BOOKS&cd=1&source=gbs_api",
				"infoLink": "https://play.google.com/store/books/details?id=k39vHp-5VeMC&source=gbs_api",
				"canonicalVolumeLink": "https://market.android.com/details?id=book-k39vHp-5VeMC"
			},
			"saleInfo": {
				"country": "US",
				"buyLink": "https://play.google.com/store/books/details?id=k39vHp-5VeMC&rdid=book-k39vHp-5VeMC&rdot=1&source=gbs_api"
			},
			"accessInfo": {
				"country": "US",
				"epub": {
					"isAvailable": true,
					"downloadLink": "http://books.google.com/books/download/Dracula.epub?id=k39vHp-5VeMC&hl=&output=epub&source=gbs_api"
				},
				"pdf": {
					"isAvailable": true,
					"downloadLink": "http://books.google.com/books/download/Dracula.pdf?id=k39vHp-5VeMC&hl=&output=pdf&sig=ACfU3U3bZnVgiOZrRN8hZXPTs6dTtrF_Ew&source=gbs_api"
				},
				"accessViewStatus": "FULL_PUBLIC_DOMAIN"
			}
		}
	]

}

var tarzan = {
	"kind": "books#volumes",
	"totalItems": 1750,
	"items": [
		{
			"kind": "books#volume",
			"id": "ZbBOAAAAMAAJ",
			"etag": "n7XvsUcaAGo",
			"selfLink": "https://www.googleapis.com/books/v1/volumes/ZbBOAAAAMAAJ",
			"volumeInfo": {
				"title": "Tarzan of the Apes",
				"authors": [
					"Edgar Rice Burroughs"
				],
				"publishedDate": "1914",
				"readingModes": {
					"text": true,
					"image": true
				},
				"maturityRating": "NOT_MATURE",
				"allowAnonLogging": false,
				"contentVersion": "1.1.2.0.full.3",
				"imageLinks": {
					"smallThumbnail": "http://books.google.com/books/content?id=ZbBOAAAAMAAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
					"thumbnail": "http://books.google.com/books/content?id=ZbBOAAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
				},
				"previewLink": "http://books.google.com/books?id=ZbBOAAAAMAAJ&printsec=frontcover&dq=tarzan&hl=&as_pt=BOOKS&cd=1&source=gbs_api",
				"infoLink": "https://play.google.com/store/books/details?id=ZbBOAAAAMAAJ&source=gbs_api",
				"canonicalVolumeLink": "https://market.android.com/details?id=book-ZbBOAAAAMAAJ"
			},
			"saleInfo": {
				"country": "US",
				"buyLink": "https://play.google.com/store/books/details?id=ZbBOAAAAMAAJ&rdid=book-ZbBOAAAAMAAJ&rdot=1&source=gbs_api"
			},
			"accessInfo": {
				"country": "US",
				"epub": {
					"isAvailable": true,
					"downloadLink": "http://books.google.com/books/download/Tarzan_of_the_Apes.epub?id=ZbBOAAAAMAAJ&hl=&output=epub&source=gbs_api"
				},
				"pdf": {
					"isAvailable": true,
					"downloadLink": "http://books.google.com/books/download/Tarzan_of_the_Apes.pdf?id=ZbBOAAAAMAAJ&hl=&output=pdf&sig=ACfU3U3FEVwK2L30RIWfVZU16Rah8Y9HYQ&source=gbs_api"
				},
				"accessViewStatus": "FULL_PUBLIC_DOMAIN"
			}
		}
	]
}

var frankenstein = {

	"kind": "books#volumes",
	"totalItems": 2019,
	"items": [
		{
			"kind": "books#volume",
			"id": "2Zc3AAAAYAAJ",
			"etag": "noV1E0+Gpco",
			"selfLink": "https://www.googleapis.com/books/v1/volumes/2Zc3AAAAYAAJ",
			"volumeInfo": {
				"title": "Frankenstein, or, The Modern Prometheus",
				"authors": [
					"Mary Wollstonecraft Shelley"
				],
				"publishedDate": "1869",
				"description": "Frankenstein was published in 1818, the work of a 21-year-old genius named Mary Shelley. Hundreds of movies, adaptations, and monster masks later, its reputation remains so lively that the title has become its own word in the English language. Victor Frankenstein, a scientist, discovers the secret of reanimating the dead. After he rejects his hideous creation, not even the farthest poles of the earth will keep his bitter monster from seeking an inhuman revenge. Inspired by a uniquely Romantic view of science’s possibilities, Shelley’s masterpiece ultimately wrestles with the hidden shadows of the human mind.",
				"readingModes": {
					"text": true,
					"image": true
				},
				"maturityRating": "NOT_MATURE",
				"allowAnonLogging": false,
				"contentVersion": "0.2.3.0.full.3",
				"panelizationSummary": {
					"containsEpubBubbles": false,
					"containsImageBubbles": false
				},
				"imageLinks": {
					"smallThumbnail": "http://books.google.com/books/content?id=2Zc3AAAAYAAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
					"thumbnail": "http://books.google.com/books/content?id=2Zc3AAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
				},
				"previewLink": "http://books.google.com/books?id=2Zc3AAAAYAAJ&printsec=frontcover&dq=frankenstein&hl=&as_pt=BOOKS&cd=1&source=gbs_api",
				"infoLink": "https://play.google.com/store/books/details?id=2Zc3AAAAYAAJ&source=gbs_api",
				"canonicalVolumeLink": "https://market.android.com/details?id=book-2Zc3AAAAYAAJ"
			},
			"saleInfo": {
				"country": "US",
				"buyLink": "https://play.google.com/store/books/details?id=2Zc3AAAAYAAJ&rdid=book-2Zc3AAAAYAAJ&rdot=1&source=gbs_api"
			},
			"accessInfo": {
				"country": "US",
				"epub": {
					"isAvailable": true,
					"downloadLink": "http://books.google.com/books/download/Frankenstein_or_The_Modern_Prometheus.epub?id=2Zc3AAAAYAAJ&hl=&output=epub&source=gbs_api"
				},
				"pdf": {
					"isAvailable": true,
					"downloadLink": "http://books.google.com/books/download/Frankenstein_or_The_Modern_Prometheus.pdf?id=2Zc3AAAAYAAJ&hl=&output=pdf&sig=ACfU3U38B1ICfQ1MGPSbplyfWhcla_A6aw&source=gbs_api"
				},
				"accessViewStatus": "FULL_PUBLIC_DOMAIN"
			},
			"searchInfo": {
				"textSnippet": "Frankenstein was published in 1818, the work of a 21-year-old genius named Mary Shelley."
			}
		}
	]

}