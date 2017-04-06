import React from 'react';

export default class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
    }
    clickHandler(path){
        console.log('logout clickHandler');
        console.log(path);
    }
    render() {
        console.log('Logout');
        console.log(this.props);
        var username = this.props.auth.username;
        var uid = this.props.auth.id;
        var profile = '/api/' + uid + '/profile';
        var profileNew = '/profile/' + uid + '/new';
        return (
            <div className="collapse navbar-collapse" id="header-links">
                <ul className="nav navbar-nav navbar-right">
                    <li className="nav-item">
                        <a onClick={this.props.cb} className='nav-link' id='/api/allPolls'>Polls</a>
                    </li>
                    <li className="dropdown">

                        <a href="#"
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                            role="button"
                            aria-haspopup="true"
                            aria-expanded="false">{username}<span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu">
                            {/*<li className="nav-item">
                                <a onClick={this.props.cb} className='nav-link' id={profile}>My Polls</a>
                            </li>
                            <li className="nav-item">
                                <a onClick={this.props.cb} className='nav-link' id={profileNew}>New Poll</a>
                            </li>
                            <li role="separator" className="divider"></li>*/}
                            <li className="nav-item">
                                <a onClick={this.props.cb} className='nav-link' id="/logout">Logout</a>
                            </li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <a onClick={this.props.cb} className='nav-link' id="about">About</a>
                    </li>
                </ul>
            </div>
        )
    }
}