import React from 'react';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    submit(e) {
        e.preventDefault();
        console.log('Signup submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.name.value);
        // console.log(e.target.elements.email.value);
        // console.log(e.target.elements.pwd.value);
        var data, name, email, pwd;
        name = e.target.elements.name.value;
        email = e.target.elements.email.value;
        pwd = e.target.elements.pwd.value;
        data = {
            route: 'signup',
            name: name,
            email: email,
            pwd: pwd,
        };
        console.log(data);
        this.props.ajax( data);

    }
    render() {
        console.log('Signup');
        console.log(this.props);
        return (
            <div>
                <h1>Signup</h1>
                <form onSubmit={this.submit} >
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" className="form-control" id="name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input type="email" className="form-control" id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" id="pwd" />
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        )
    }
}