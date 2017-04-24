import React from 'react';
import Tweet from './tweet.jsx';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        // console.log('Start props');
        // console.log(this.props);
        return (
            <div className="jumbotron" >
                <div className='page-header'>
                    <h1>Welcome</h1>
                </div>
                <h2>Please Login or Signup to start lending books.</h2>
                <h3>Tweet your friends and let them know!</h3>
                <Tweet />
            </div>
        );
    }
}