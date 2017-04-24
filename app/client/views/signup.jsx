import React from 'react';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    submit(e) {
        e.preventDefault();
        // console.log('Signup submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.name.value);
        // console.log(e.target.elements.email.value);
        // console.log(e.target.elements.password.value);
        var data, name, email, password;
        email = e.target.elements.email.value;
        password = e.target.elements.password.value;
        data = {
            route: 'signup',
            email: email,
            password: password,
        };
        // console.log(data);
        this.props.ajax(data);

    }
    render() {
        // console.log('Signup');
        // console.log(this.props);
        var error, message = this.props.auth.error;
        if (message === null) {
            error = null;
        } else {
            error = (
                <div className="panel panel-danger">
                    <div className="panel-heading">Error: {message}</div>
                </div>
            )
        }
        return (
            <div className='jumbotron'>
                <h1>Signup</h1>
                <form onSubmit={this.submit} >
                    {error}
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input type="email" className="form-control" id="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" required />
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        )
    }
}