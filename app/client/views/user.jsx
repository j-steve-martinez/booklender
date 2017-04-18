import React from 'react';

export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        var data = {
            isConfirm: false,
            book: {}
        };
        this.state = data;
    }
    onClick(e) {
        // console.log('onClick');
        // console.log(e.target.id);
        e.preventDefault();

        var uid, book;
        book = this.props.books.filter(obj => {
            return obj._id === e.target.id
        })[0];
        // console.log(book);
        var data = {
            isConfirm: true,
            book: book
        };
        function findPos(obj) {
            var curtop = 0;
            if (obj.offsetParent) {
                do {
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return [curtop];
            }
        }
        window.scrollTo(0, findPos(document.getElementById("confirm")));
        // scrollTo(0, 100);
        this.setState(data);
    }
    onSubmit(e) {
        e.preventDefault();
        // console.log('login submit');
        // console.log(e.target.elements);
        // console.log(e.target.elements.title.value);
        var data, title;
        title = e.target.elements.title.value;
        e.target.elements.title.value = '';
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
        // console.log('onConfirm');
        // console.log(e.target.id);
        // console.log(e.target.name);
        // console.log(this.state);
        var book, route, data;
        if (e.target.id !== 'cancel') {

            book = this.props.books.filter(obj => {
                // console.log(obj);
                return obj._id === e.target.name;
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
            route = 'borrow';
            if (e.target.id === 'delete') {
                route = 'delete';
            }
            data = {
                route: route,
                book: book
            }
            // console.log(data);
            this.props.ajax(data);
        }
        this.setState({ isConfirm: false, book: {} });
    }
    render() {
        // console.log('User');
        // console.log(this.props);
        // console.log(this.state);
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
                    // <img key={key} id={obj.bid} src={obj.thumbnail} alt={obj.title} height="180" width="128" ></img>
                    <a key={key} onClick={this.onClick} href='#' >
                        <img id={obj._id} src={obj.thumbnail} alt={obj.title} height="180" width="128" ></img>
                    </a>
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
                        <button onClick={this.onConfirm} name={obj._id} id='return' type='submit' className="btn btn-success btn-lg">Return</button>
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
                        <button onClick={this.onConfirm} name={obj._id} id='yes' type='submit' className="btn btn-success btn-lg">Yes</button>
                        <button onClick={this.onConfirm} name={obj._id} id='no' type='submit' className="btn btn-danger btn-lg">No</button>
                    </form>
                )
                return html;
            })
        } else {
            booksHtml = null;
            requestsHtml = null;
        }

        if (this.state.isConfirm) {
            if (this.state.book.isAccept === true || this.state.book.isRequest) {
                confirm = (
                    <div className="alert alert-danger alert-dismissible" role="alert">
                        <strong>{this.state.book.title}</strong> has been requested or is on loan. Try again later.
                    </div>
                )
            } else {
                confirm = (
                    <form className="form-horizontal">
                        <label className='well text-danger' >Delete: {this.state.book.title}? </label>
                        <button onClick={this.onConfirm} name={this.state.book._id} id='delete' className="btn btn-success btn-lg" >Delete</button>
                        <button onClick={this.onConfirm} name={this.state.book._id} id='cancel' className="btn btn-danger btn-lg" >Cancel</button>
                    </form>
                )
            }
        } else {
            confirm = null;
        }
        var location, city, state;
        location = null;
        city = this.props.auth.city;
        state = this.props.auth.state;
        this.props.auth.name ? name = this.props.auth.name : name = null;
        this.props.auth.email ? email = this.props.auth.email : email = null;

        if (city && state) {
            location = city + ', ' + state;
        } else if (city) {
            location = city;
        } else if (state) {
            location = state;
        }

        return (
            <div className="jumbotron" >
                <div className="page-header">
                    <h1>{email} <small>{name}</small></h1>
                </div>
                <h3>{location}</h3>
                <br id='confirm' />
                {confirm}
                {requestsHtml}
                <div>
                    <form onSubmit={this.onSubmit} >
                        <div className="form-group">
                            <label htmlFor="title"><h4>Book Title:</h4></label>
                            <input type="text" className="form-control" id="title" />
                        </div>
                        <button id='add' type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <br />
                {borrowedHtml}
                {booksHtml}
            </div>
        )
    }
}