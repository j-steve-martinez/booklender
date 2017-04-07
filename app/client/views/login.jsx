import React from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    submit(e) {
        e.preventDefault();
        console.log('login submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.email.value);
        // console.log(e.target.elements.pwd.value);
        var data, email, pwd;
        email = e.target.elements.email.value;
        pwd = e.target.elements.pwd.value;
        data = {
            route: 'user',
            email: email,
            pwd: pwd,
        };
        console.log(data);
        this.props.ajax(data);

    }
    render() {
        console.log('Login');
        console.log(this.props);
        return (
            <div>
                <h1>Login</h1>
                <form onSubmit={this.submit} >
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input type="email" className="form-control" id="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" id="pwd" required />
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        )
    }
}