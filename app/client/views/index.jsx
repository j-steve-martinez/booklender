
/**
 * User Story: I can view all books posted by every user.
 * User Story: I can add a new book.
 * User Story: I can update my settings to store my full name, city, and state.
 * User Story: I can propose a trade and wait for the other user to accept the trade.
 */

'use strict'
var React = require('react');
var ReactDOM = require('react-dom');

import Header from './header.jsx';
import Login from './login.jsx';
import Signup from './signup.jsx';
import Start from './start.jsx';

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
        this.setState({ route: route });
    }
    ajax(data) {
        console.log('main ajax');
        console.log(data);
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
            case 'signup':
                page = <Signup ajax={this.ajax} />
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