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
        this.router = this.router.bind(this);
        this.ajax = this.ajax.bind(this);
        this.state = { auth: false, route: 'start' };
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
            var auth = false;
            this.setState({ route: route, auth: auth });
        } else {
            this.setState({ route: route });
        }
    }
    ajax(data) {
        console.log('main ajax');
        console.log(data);
        /**
         * Ajax to the server
         */
        var url, URL, method, contentType, route, header = {};

        route = data.route;
        url = window.location.origin;

        switch (route) {
            case 'user':
                console.log('route: user');
                url = '/login' //+ encodeURIComponent('?email=' + data.email + '&' + 'password=' + data.pwd);
                // url += '/test'
                header.url = url;
                header.method = 'POST';
                // header.contentType = 'text/html';
                // header.dataType = 'text'
                // header.data = JSON.stringify(data);
                header.data = data;
                header.dataType = 'html';
                break;
            case 'signup':
                console.log('route: user');
                url = '/signup' 
                //+ encodeURIComponent('?email=' + data.email + '&' + 'password=' + data.pwd);
                header.url = url;
                header.method = 'POST';
                header.contentType = "application/json";
                // header.contentType = "text/html";
                // header.dataType = 'application/json'
                header.dataType = 'json'
                // header.dataType = 'text'
                header.data = JSON.stringify(data);
                // header.data = data;
                // header.data = encodeURIComponent('email=' + data.email + '&' + 'password=' + data.password);
                break;
            default:
                break;
        }

        console.log('ajax header');
        console.log(header);
        // url = window.location.origin + '/api/quotes';
        // header.url = url;
        // header.method = 'POST';
        // header.data = JSON.stringify(data);
        // header.contentType = "application/json";
        // header.dataType = 'json';

        /**
         * Get data from server
         */
        $.ajax(header)
            .then(results => {
                console.log('AJAX .then');
                console.log(results);
                console.log(results.user.email);
    
            })
            .fail(err=>{
                console.log('AJAX .fail');
                console.log(err);
            });
            console.log('AJAX Finished');

        /**
         * This is a mockup
         */
        var route, auth;
        route = data.route;
        auth = { id: '12345', email: 'foo@bar.com' }
        this.setState({ route: route, auth: auth });
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
                page = <Signup ajax={this.ajax} />
                break;
            case 'user':
                page = <User ajax={this.ajax} />
                break;
            case 'books':
                page = <Books ajax={this.ajax} />
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