import React from 'react';
// import Login from './login.jsx';
// import Logout from './logout.jsx';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.cH = this.cH.bind(this);
    }
    cH(e){
        console.log('Header cH');
        console.log(e.target.id);
        e.preventDefault();
        this.props.router(e.target.id);
    }
    render() {
        console.log('header props');
        console.log(this.props);
        // var auth = this.props.auth;
        // console.log('auth');
        // console.log(auth);
        // var myHeader;
        // if (auth.id !== undefined && auth.id !== false) {
        //     console.log('is logged in');
        //     myHeader = <Logout router={this.props.router} auth={auth} />;
        // } else {
        //     console.log('not logged in');
        //     myHeader = <Login router={this.props.router} auth={auth} />;
        // }
        /**
         * Login links should be:
         *  All Books
         *  My Books
         *  Configure glyphicon
         *  Logout glyphicon
         */
        var logout = (
            <ul className="nav navbar-nav navbar-right" >
                <li><a id="allBooks" onClick={this.cH} href="#"><span className="glyphicon glyphicon-book"></span> All Books</a></li>
                <li><a id="myBooks" onClick={this.cH} href="#"><span className="glyphicon glyphicon-user"></span> My Books</a></li>
                <li><a id="configure" onClick={this.cH} href="#"><span className="glyphicon glyphicon-cog"></span> Configure</a></li>
                <li><a id="logout" onClick={this.cH} href="#"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>
        );
        var login = (
            <ul className="nav navbar-nav navbar-right" >
                <li><a id="signup" onClick={this.cH} href="#"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                <li><a id="login" onClick={this.cH} href="#"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>
        );
        var navs = login;
        // var navs = logout;
        return (
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a id="start" onClick={this.cH} className="navbar-brand" href="#">Book Lender</a>
                    </div>
                    {navs}
                </div>
            </nav>
        );
    }
}