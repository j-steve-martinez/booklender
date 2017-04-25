'use strict'

var React = require('react');
var ReactDOM = require('react-dom');

import About from './about.jsx';
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
        this.router = this.router.bind(this);
        this.ajax = this.ajax.bind(this);
        var auth = { _id: false, error: null };
        this.state = { auth: auth, books: [] };
    }
    router(route) {
        // console.log('main router');
        // console.log(route);
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

            data._id ? id = data._id : id = false;
            data.name ? name = data.name : name = '';
            data.email ? email = data.email : email = '';
            data.city ? city = data.city : city = '';
            data.state ? state = data.state : state = '';
            data.error ? error = data.error : error = null;

            obj = {
                _id: id,
                name: name,
                email: email,
                city: city,
                state: state,
                error: error
            }
            return obj;
        }

        books = this.state.books
        route = data.route;

        switch (route) {
            case 'signup':
                // console.log('route: signup');
                url = '/signup'
                header.method = 'POST';
                header.url = url;
                break;
            case 'borrow':
                // console.log('route: titles');
                url = '/api/books'
                header.method = 'PUT';
                header.url = url;
                break;
            case 'delete':
                // console.log('route: titles');
                url = '/api/books'
                header.method = 'DELETE';
                header.url = url;
                break;
            case 'titles':
                // console.log('route: titles');
                url = '/api/books'
                header.method = 'GET';
                header.url = url;
                break;
            case 'title':
                // console.log('route: title');
                url = '/api/books'
                header.method = 'POST';
                header.url = url;
                break;
            case 'update':
                // console.log('route: update');
                url = '/update'
                header.method = 'POST';
                header.url = url;
                break;
            case 'user':
                // console.log('route: user');
                url = '/login';
                header.method = 'POST';
                header.url = url;
                break;
            default:
                break;
        }
        header.contentType = "application/json";
        header.dataType = 'json'
        header.data = JSON.stringify(data);
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
                    case 'delete':
                        // console.log('delete .then');
                        reroute = 'user';
                        book = results;
                        // console.log(book);
                        books = this.state.books.filter(obj => {
                            return obj._id !== book._id;
                        });
                        // console.log(books);
                        auth = parseAuth(this.state.auth);
                        var data = {
                            action: 'delete',
                            book: book
                        }
                        this.state.primus.write(data);
                        break;
                    case 'borrow':
                        // console.log('borrow .then');
                        reroute = 'user';
                        book = results;
                        // console.log(book);
                        books = this.state.books;
                        books.forEach(obj => {
                            if (obj._id === book._id) {
                                obj.isAccept = book.isAccept;
                                obj.isRequest = book.isRequest;
                                obj.lendee = book.lendee;
                            }
                        });
                        // console.log(books);
                        auth = parseAuth(this.state.auth);
                        var data = {
                            action: 'borrow',
                            book: book
                        }
                        this.state.primus.write(data);
                        break;
                    case 'title':
                        // console.log('title .then');
                        reroute = 'user';
                        book = results;
                        // console.log(this.state.auth);
                        // console.log(book);

                        books.push(book);
                        auth = parseAuth(this.state.auth);
                        var data = {
                            action: 'add',
                            book: book
                        }
                        this.state.primus.write(data);
                        // console.log(auth);
                        break;
                    case 'titles':
                        // console.log('title .then');
                        reroute = 'start';
                        books = results;
                        // console.log(this.state.auth);
                        // console.log(books);
                        auth = parseAuth(this.state.auth)
                        // console.log(auth);
                        break;
                    case 'user':
                        // console.log('user .then');
                        reroute = 'user';
                        auth = parseAuth(results.user);
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
                // console.log(err);
                var auth = this.state.auth;
                if (err.responseJSON.error) {
                    auth.error = err.responseJSON.error;
                    this.setState({ route: route, auth: auth });
                } else {
                    console.log('An unknown server error occured occured!');
                    alert('An unknown server error occured occured!');
                    this.setState({ route: 'start'});
                }
            });
    }
    componentDidMount() {
        /**
         * Set the primus handler
         */
        var primus = new Primus();
        primus.on('data', data => {
            // console.log('primus book');
            // console.log(data);
            // console.log(typeof data);
            if (typeof data === 'object') {
                // console.log('primus setting state');
                // console.log(data);
                var action, book, books;
                action = data.action;
                book = data.book;
                switch (action) {
                    case 'add':
                        // console.log('primus case add');
                        books = this.state.books;
                        books.push(book);
                        // console.log('books');
                        // console.log(books);
                        this.setState({ books: books })
                        break;
                    case 'borrow':
                        // console.log('primus case borrow');
                        books = this.state.books;
                        books.forEach(obj => {
                            if (obj._id === book._id) {
                                obj.isAccept = book.isAccept;
                                obj.isRequest = book.isRequest;
                                obj.lendee = book.lendee;
                            }
                        });
                        // console.log('books');
                        // console.log(books);
                        this.setState({ books: books })
                        break;
                    case 'delete':
                        // console.log('primus case delete');
                        books = this.state.books.filter(obj => {
                            return obj._id !== book._id;
                        });
                        // console.log('books');
                        // console.log(books);
                        this.setState({ books: books })
                        break;
                }
                // console.log('books');
                // console.log(books);

            }
        });
        var data = {
            route: 'titles',
            primus: primus
        }
        this.ajax(data)
    }
    render() {
        // console.log('Main render');
        // console.log(this.state);
        var page, error, route;
        route = this.state.route;
        error = this.state.auth.error;
        if (error) {
            route = error.type;
        }
        switch (route) {
            case 'start':
                page = <Start />
                break;
            case 'login':
                page = <Login ajax={this.ajax} auth={this.state.auth} />
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
                page = <Books ajax={this.ajax} auth={this.state.auth} books={this.state.books} />
                break;
            case 'about':
                page = <About />
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
