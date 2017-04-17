import React from 'react';

export default class About extends React.Component {
  render() {
    var fccProjectURL, fccProjectName, appName, herokuURL, githubURL;
    fccProjectName = 'Manage a Book Trading Club';
    fccProjectURL = "https://www.freecodecamp.com/challenges/manage-a-book-trading-club";
    appName = 'Book Lender';
    herokuURL = "https://booklender.herokuapp.com/";
    githubURL = "https://github.com/j-steve-martinez/booklender";

    return (
      <div className='jumbotron' >
        <h1>{appName}</h1>
        <p>
          This site is for the <a href="https://www.freecodecamp.com" target="_blank">freeCodeCamp </a>
          Dynamic Web Applications Project:
          <a href={fccProjectURL} target="_blank"> {fccProjectName}</a>.
          <br></br>
          <br></br>
          It is a full stack web application that uses:
          <ul>
            <li>
              <a href="https://www.mongodb.com/" target="_blank">Database: mongoDB </a>
            </li>
            <li>
              <a href="https://nodejs.org" target="_blank">Server: Node.js </a>
            </li>
            <li>
              <a href="https://facebook.github.io/react/" target="_blanks">Views: React.js </a>
            </li>
            <li>
              <a href="http://getbootstrap.com" target="_blank">Stylesheets: Bootstrap </a>
            </li>
          </ul>
          <span id='warning'>
            This application is for educational purposes only.  Any and all data may be removed at anytime without warning.
          </span>
        </p>
        <div className='text-center' >
          <div>
            <a className='link' href="https://github.com/j-steve-martinez" target="_blank">
              J. Steve Martinez
            </a>
          </div>
          <div>
            <a className='link' href={herokuURL} target="_blank">
              Heroku
            </a>
          </div>
          <div>
            <a className='link' href={githubURL} target="_blank">
              Github
            </a>
          </div>
        </div>
      </div>
    )
  }
}