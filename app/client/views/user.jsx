import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        this.submit = this.submit.bind(this);
    }
    clickHandler(path) {
        // console.log('User clickHandler');
        // console.log(path);
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
        // console.log(data);
        this.props.ajax(data);
    }
    onConfirm(e) {
        e.preventDefault();
        console.log(e.target.id);
    }
    render() {
        console.log('User');
        console.log(this.props);
        var books, booksHtml, requests, requestsHtml, name, email, city, state;

        /**
         * Make sure some books exist
         */
        if (this.props.books.length > 0) {
            /**
             * Filter out user books
             */
            books = this.props.books.filter(obj => {
                // console.log(obj.uid);
                // console.log(this.props.auth._id);
                return obj.uid === this.props.auth._id
            });

            booksHtml = books.map((obj, key) => {
                // console.log(key);
                // console.log(obj._id);
                var html = (
                        <img key={key} id={obj.bid} src={obj.thumbnail} alt={obj.title} height="180" width="128" ></img>
                )
                return html;
            })

            /**
             * Get the books other users want to borrow
             */
            console.log('books.filter');
            requests = books.filter(obj => {
                console.log(obj);
                return obj.isRequest === true;

            });

            requestsHtml = requests.map((obj, key) => {
                // console.log(key);
                // console.log(obj._id);
                var html = (
                    <form key={key} className="form-horizontal">
                        <label className='well text-danger' >Loan: {obj.title}</label>
                        <button onClick={this.onConfirm} id='yes' type='submit' className="btn btn-success btn-lg">YES</button>
                        <button onClick={this.onConfirm} id='no' type='submit' className="btn btn-danger btn-lg">NO</button>
                    </form>
                )
                return html;
            })
        } else {
            booksHtml = null;
            requestsHtml = null;
        }

        this.props.auth.name ? name = this.props.auth.name : name = null;
        this.props.auth.email ? email = this.props.auth.email : email = null;
        this.props.auth.city ? city = 'City: ' + this.props.auth.city : city = null;
        this.props.auth.state ? state = 'State: ' + this.props.auth.state : state = null;

        return (
            <div className="jumbotron" >
                <h1>{name}</h1>
                <h2>{email}</h2>
                <h3>{city}</h3>
                <h3>{state}</h3>
                <br />
                {requestsHtml}
                <div>
                    <form onSubmit={this.submit} >
                        <div className="form-group">
                            <label htmlFor="title">Book Title:</label>
                            <input type="text" className="form-control" id="title" />
                        </div>
                        <button type="submit" className="btn btn-default">Submit</button>
                    </form>
                </div>
                <br />
                {booksHtml}
            </div>
        )
    }
}