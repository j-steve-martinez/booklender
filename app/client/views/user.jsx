import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        // console.log('login submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.title.value);
        var data, title;
        title = e.target.elements.title.value;
        if (title !== '') {
            data = {
                route: 'title',
                title: title,
            };
            // console.log(data);
            this.props.ajax(data);
        }
    }
    onConfirm(e) {
        e.preventDefault();
        // console.log(e.target.id);
        // console.log(e.target.name);
        var book, route, data;
        book = this.props.books.filter(obj => {
            return obj.bid === e.target.name;
        })[0];
        if (e.target.id === 'yes') {
            book.isAccept = true;
            book.isRequest = true;
        } else {
            book.isAccept = false;
            book.isRequest = false;
            book.lendee = '';
        }
        // console.log(book);
        data = {
            route: 'borrow',
            book: book
        }
        this.props.ajax(data);
    }
    render() {
        // console.log('User');
        // console.log(this.props);
        var books, booksHtml, borrowed, borrowedHtml, requests, requestsHtml, name, email, city, state;

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
             * Filter out borrowed books
             */
            borrowed = this.props.books.filter(obj => {
                // console.log(obj.uid);
                // console.log(this.props.auth._id);
                return obj.lendee === this.props.auth._id && obj.isAccept === true;
            });
            // console.log('borrowed');
            // console.log(borrowed);

            borrowedHtml = borrowed.map((obj, key) => {
                // console.log(key);
                // console.log(obj._id);
                var html = (
                    <form key={key} className="form-horizontal">
                        <label className='well text-success' >Return: {obj.title}</label>
                        <button onClick={this.onConfirm} name={obj.bid} id='return' type='submit' className="btn btn-success btn-lg">Return</button>
                    </form>
                )
                return html
            });

            /**
             * Get the books other users want to borrow
             */
            // console.log('books.filter');
            requests = books.filter(obj => {
                // console.log(obj);
                return obj.isRequest === true && obj.isAccept === false;

            });
            // console.log('requests');
            // console.log(requests);

            requestsHtml = requests.map((obj, key) => {
                // console.log(key);
                // console.log(obj._id);
                var html = (
                    <form key={key} className="form-horizontal">
                        <label className='well text-danger' >Loan: {obj.title}</label>
                        <button onClick={this.onConfirm} name={obj.bid} id='yes' type='submit' className="btn btn-success btn-lg">Yes</button>
                        <button onClick={this.onConfirm} name={obj.bid} id='no' type='submit' className="btn btn-danger btn-lg">No</button>
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
                    <form onSubmit={this.onSubmit} >
                        <div className="form-group">
                            <label htmlFor="title"><h4 className='text-primary' >Book Title:</h4></label>
                            <input type="text" className="form-control" id="title" />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <br />
                {borrowedHtml}
                {booksHtml}
            </div>
        )
    }
}