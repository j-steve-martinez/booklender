import React from 'react';

export default class Config extends React.Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    submit(e) {
        e.preventDefault();
        // console.log('Config submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.name.value);
        // console.log(e.target.elements.email.value);
        // console.log(e.target.elements.city.value);
        // console.log(e.target.elements.state.value);
        var data, id, name, email, city, state;
        id = this.props.auth._id;
        name = e.target.elements.name.value;
        email = e.target.elements.email.value;
        city = e.target.elements.city.value;
        state = e.target.elements.state.value;
        data = {
            route: 'update',
            id: id,
            name: name,
            email: email,
            city: city,
            state: state
        };
        // console.log(data);
        this.props.ajax(data);

    }
    render() {
        // console.log('Config');
        // console.log(this.props);
        var name, email, city, state;
        name = this.props.auth.name;
        email = this.props.auth.email;
        city = this.props.auth.city;
        state = this.props.auth.state;

        return (
            <div className='jumbotron'>
                <div className='page-header'>
                    <h1>Update Your Profile</h1>
                </div>
                <form onSubmit={this.submit} >
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" value={email} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input type="text" className="form-control" id="name" defaultValue={name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input type="text" className="form-control" id="city" defaultValue={city} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <input type="text" className="form-control" id="state" defaultValue={state} />
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        )
    }
}