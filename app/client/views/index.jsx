/**
 * User Story: I can view all books posted by every user.
 * User Story: I can add a new book.
 * User Story: I can update my settings to store my full name, city, and state.
 * User Story: I can propose a trade and wait for the other user to accept the trade.
 */

'use strict'
var React = require('react');
var ReactDOM = require('react-dom');

import Books from './books.jsx';
import Config from './config.jsx'
import Header from './header.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import Start from './start.jsx';
import User from './user.jsx';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        var auth = { _id: false, error: null };
        this.router = this.router.bind(this);
        this.ajax = this.ajax.bind(this);
        // this.auth = this.auth.bind(auth);
        this.state = { auth: auth, route: 'start', books: [] };
    }
    router(route) {
        console.log('main router');
        console.log(route);
        /**
         * Routes:
         *  login
         *  signup
         *  books
         *  user
         *  config
         *  logout
         */
        if (route === 'logout') {
            var auth = { _id: false, error: null };
            this.setState({ route: route, auth: auth });
        } else {
            var auth = this.state.auth;
            auth.error = null;
            this.setState({ route: route, auth: auth });
        }
    }
    ajax(data) {
        // console.log('main ajax');
        // console.log(data);
        /**
         * Ajax to the server
         */
        var auth, book, books, url, URL, method, primus, contentType, route, reroute, header = {}, state = {};
        if (data.primus) {
            state.primus = data.primus;
            delete data.primus;
        }
        function parseAuth(data) {
            var auth, books, error, obj, id, name, email, city, state;
            // console.log('parseAuth');
            // console.log(data);
            // console.log(book);
            data._id ? id = data._id : id = false;
            data.name ? name = data.name : name = '';
            data.email ? email = data.email : email = '';
            data.city ? city = data.city : city = '';
            data.state ? state = data.state : state = '';
            data.error ? error = data.error : error = null;
            // data.books ? books = data.books : books = [];

            obj = {
                _id: id,
                name: name,
                email: email,
                city: city,
                state: state,
                // books: books,
                error: error
            }

            // if (books !== undefined) {
            //     console.log('parseAuth adding new book');
            //     obj.books.push(book);
            // }
            // console.log('parseAuth obj');
            // console.log(obj);
            return obj;
        }

        books = this.state.books
        route = data.route;
        url = window.location.origin;

        switch (route) {
            case 'signup':
                // console.log('route: signup');
                url = '/signup'
                header.url = url;
                header.method = 'POST';
                header.contentType = "application/json";
                header.dataType = 'json'
                header.data = JSON.stringify(data);
                break;
            case 'titles':
                // console.log('route: titles');
                url = '/api/books'
                header.url = url;
                header.method = 'GET';
                header.contentType = "application/json";
                header.dataType = 'json'
                header.data = JSON.stringify(data);
                break;
            case 'title':
                // console.log('route: title');
                url = '/api/books'
                header.url = url;
                header.method = 'POST';
                header.contentType = "application/json";
                header.dataType = 'json'
                header.data = JSON.stringify(data);
                break;
            case 'update':
                // console.log('route: update');
                url = '/update'
                header.url = url;
                header.method = 'POST';
                header.contentType = "application/json";
                header.dataType = 'json'
                header.data = JSON.stringify(data);
                break;
            case 'user':
                // console.log('route: user');
                url = '/login';
                header.url = url;
                header.method = 'POST';
                header.contentType = "application/json";
                header.dataType = 'json'
                header.data = JSON.stringify(data);
                break;
            default:
                break;
        }

        // console.log('ajax header');
        // console.log(header);

        /**
         * Get data from server
         */
        $.ajax(header)
            .then(results => {
                // console.log('AJAX .then');
                // console.log(results);
                // console.log(route);
                // console.log(results.user.email);
                // console.log(results.user.password);
                switch (route) {
                    case 'signup':
                        // console.log('signup .then');
                        reroute = 'user';
                        auth = parseAuth(results.user, null);
                        // console.log(auth);
                        break;
                    case 'update':
                        // console.log('update .then');
                        reroute = 'user';
                        // console.log(results.user);
                        auth = parseAuth(results.user, null);
                        // console.log(auth);
                        break;
                    case 'title':
                        // console.log('title .then');
                        reroute = 'user';
                        book = results;
                        // console.log(this.state.auth);
                        // console.log(book);

                        books.push(book);
                        auth = parseAuth(this.state.auth)
                        // console.log(auth);
                        break;
                    case 'titles':
                        // console.log('title .then');
                        reroute = 'start';
                        books = results;
                        // console.log(this.state.auth);
                        // console.log(books);
                        // books.push(book);
                        auth = parseAuth(this.state.auth)
                        // console.log(auth);
                        break;
                    case 'user':
                        // console.log('user .then');
                        reroute = 'user';
                        auth = parseAuth(results.user, null);
                    // console.log(auth);
                }
                // console.log('reroute..........');
                // console.log(reroute);

                state.route = reroute;
                state.auth = auth;
                state.books = books;

                if (reroute !== undefined) {
                    this.setState(state);
                }
            })
            .fail(err => {
                // console.log('AJAX .fail');
                if (route === 'signup') {
                    // console.log(JSON.parse(err.responseText));
                    var auth = this.state.auth;
                    auth.error = JSON.parse(err.responseText).error;
                    // console.log(auth);
                    this.setState({ route: route, auth: auth });

                }
            });


        /**
         * This is a mockup
         */
        // var route, auth;
        // route = data.route;
        // auth = { id: '12345', email: 'foo@bar.com' }
    }
    componentDidMount() {
        /**
         * Set the primus handler
         */
        var primus = new Primus();
        primus.on('data', pData => {
            // console.log('primus pData');
            // console.log(pData);
            if (typeof pData === 'object') {
                this.setState({ pData: pData })
            }
        });
        // primus.write({ _id: false, title: 'tarzan', name: 'Foo Man' });
        var data = {
            route: 'titles',
            primus: primus
        }
        this.ajax(data)
        // this.setState({ primus: primus });
    }
    render() {
        console.log('Main render');
        console.log(this.state);
        var page;
        switch (this.state.route) {
            case 'start':
                page = <Start />
                break;
            case 'login':
                page = <Login ajax={this.ajax} />
                break;
            case 'config':
                page = <Config ajax={this.ajax} auth={this.state.auth} />
                break;
            case 'signup':
                page = <Signup ajax={this.ajax} auth={this.state.auth} />
                break;
            case 'user':
                page = <User ajax={this.ajax} auth={this.state.auth} books={this.state.books} />
                break;
            case 'books':
                page = <Books ajax={this.ajax} books={this.state.books} />
                break;
            default:
                page = <Start />
                break;
        }
        return (
            <div className="container" >
                <Header router={this.router} auth={this.state.auth} />
                {page}
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('content')
);

var mockBook = {
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