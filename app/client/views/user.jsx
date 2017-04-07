import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.submit = this.submit.bind(this);
    }
    clickHandler(path) {
        console.log('User clickHandler');
        console.log(path);
    }
    submit(e) {
        e.preventDefault();
        console.log('login submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.title.value);
        var data, title;
        title = e.target.elements.title.value;
        data = {
            route: 'title',
            title: title,
        };
        console.log(data);
        this.props.ajax(data);
    }
    render() {
        console.log('User');
        console.log(this.props);
        var lending, borrow;
        lending = 2;
        borrow = 3;
        return (
            <div className="jumbotron" >
                <h2>Username Mockup</h2>
                <button className="btn btn-primary" type="button">
                    Borrowed <span className="badge">{borrow}</span>
                </button>
                <button className="btn btn-primary" type="button">
                    Lending <span className="badge">{lending}</span>
                </button>
                <div>
                    <form onSubmit={this.submit} >
                        <div className="form-group">
                            <label htmlFor="title">Book Title:</label>
                            <input type="text" className="form-control" id="title" />
                        </div>
                        <button type="submit" className="btn btn-default">Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}