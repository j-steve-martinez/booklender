import React from 'react';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log('Start props');
        // console.log(this.props);
        return (
            <div className="jumbotron" >
                <h1>Welcome</h1>
                <h3>Please Login or Signup to start lending books.</h3>
            </div>
        );
    }
}