import React from 'react';

export default class About extends React.Component {
  render(){
    return (
      <Body title="My App">
        <p className='about bg-warning'>
          This web site is for the <a href="https://www.freecodecamp.com" target="_blank">freeCodeCamp </a>
          Dynamic Web Applications Project:
          <a href="https://www.freecodecamp.com/challenges/build-a-voting-app" target="_blank"> Build a Voting App</a>.
          <br></br>
          <br></br>
          It is a full stack web application that uses
          <a href="https://www.mongodb.com/" target="_blank"> mongoDB </a>
          for the back end database,
          <a href="https://nodejs.org" target="_blank"> Node.js </a>
          for the web server and
          <a href="https://facebook.github.io/react/" target="_blanks"> React.js </a>
          to render html in the client browser.
          <br></br>
          <br></br>
          The app also uses
          <a href="http://getbootstrap.com" target="_blank"> Bootstrap </a>
          for the style sheets and
          <a href="http://www.chartjs.org" target="_blank"> Chart.js </a> to render the data in a bar chart.
          <br></br>
          <br></br>
          <span id='warning'>
            This application is for educational purposes only.  Any and all data may be removed at anytime without warning.
          </span>
        </p>
        <div id="credits">
          <div>
            <span className="credit">Created By: </span>
            <a className='link' href="https://github.com/j-steve-martinez" target="_blank">
              J. Steve Martinez
            </a>
          </div>
          <div>
            <div className="credit">Heroku:</div>
            <a className='link' href="https://my-app-jsm.herokuapp.com/">
              https://my-app-jsm.herokuapp.com
            </a>
          </div>
          <div>
            <div className="credit">GitHub:</div>
            <a className='link' href="https://github.com/j-steve-martinez/my-app">
              https://github.com/j-steve-martinez/my-app
            </a>
          </div>
        </div>

      </Body>
    )
  }
}