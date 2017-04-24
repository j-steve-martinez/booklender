import React from 'react';

export default class Books extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        var data = {
            isConfirm: false,
            book: {}
        };
        this.state = data;
    }
    onClick(e) {
        e.preventDefault();
        // console.log(e.target);
        // console.log(e.target.id);
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
        window.scrollTo(0,findPos(document.getElementById("title")));
        this.setState(data);
    }
    onConfirm(e) {
        e.preventDefault();
        // console.log(e.target.id);

        if (e.target.id === 'yes') {
            var data = this.state;
            delete data.isConfirm;
            data.route = 'borrow'
            data.book.isRequest = true;
            data.book.lendee = this.props.auth._id;
            // console.log(data);
            this.props.ajax(data)
        } else {
            var data = {
                isConfirm: false,
                book: {}
            };
            this.setState(data);
        }
    }
    render() {
        // console.log('Books props');
        // console.log(this.props);
        // console.log(this.state);
        var books, confirm;
        books = this.props.books
            /**
             * Filter out books that have been requested
             */
            .filter((obj, key) => {
                return obj.isRequest === false && obj.uid !== this.props.auth._id;
            })
            .map((obj, key) => {
                // console.log(key);
                // console.log(obj._id);
                var tmp = (
                    <a key={key} onClick={this.onClick} href='#' >
                        <img id={obj._id} src={obj.thumbnail} alt={obj.title} height="180" width="128" ></img>
                    </a>
                )
                return tmp;
            });
        // console.log(books);
        if (this.state.isConfirm) {
            confirm = (
                <form className="form-horizontal">
                    <label className='well text-danger' >Borrow: {this.state.book.title}? </label>
                    <button onClick={this.onConfirm} id='yes' className="btn btn-success btn-lg" >Yes</button>
                    <button onClick={this.onConfirm} id='no' className="btn btn-danger btn-lg" >No</button>
                </form>
            )
        } else {
            confirm = null;
        }
        return (
            <div className="jumbotron" >
                <h1 id='title' >Available Books</h1>
                {confirm}
                <br />
                {books}
            </div>
        );
    }
}