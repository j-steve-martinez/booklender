import React from 'react';

export default class Books extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log('Books props');
        console.log(this.props);
        return (
            <div className="jumbotron" >
                <h2>Available Books</h2>
                <span className="glyphicon glyphicon-book" ></span>
                <span className="glyphicon glyphicon-book" ></span> 
                <span className="glyphicon glyphicon-book" ></span>
            </div>
        );
    }
}