import React from 'react';

export default class Tweet extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log(this.props.poll);
        var id = this.props.poll._id;
        var name = 'New Poll: ' + this.props.poll.name;
        var url = window.location.href + '?poll=' + id;
        var elem = document.getElementById('twit-share');
        var data = {};
        data.text = name;
        data.size = 'large';
        twttr.widgets.createShareButton(url, elem, data);
    }
    render() {
        return <a id='twit-share'></a>
    }
}
