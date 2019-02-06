import React from 'react';

function AudioPlayer(props) {
  return (
    <div className="wrapper">
      <div className="player">
        <div className="episode-info">
          <img className="artwork-in-player" src="https://d3sv2eduhewoas.cloudfront.net/channel/image/bf96db90015f4a408de47dfddc8453cd.png" alt="podcast artwork" />
          <div>
            <a className="title1" href="/episode-id">Inventing the Future</a><br />
            <a className="title2" href="/podcast-id">The Knowledge Project with Shane Parrish</a>
          </div>
        </div>
        <div className="player-controls">
          <div className="main-controls">
            <span className="speed">1.5x</span>
            <span className="playcontrols">
              <i data-skip="-10" className="material-icons custom-color">replay_10</i>
              <i className="material-icons custom-color">play_arrow</i>
              <i data-skip="10" className="material-icons custom-color">forward_10</i>
            </span>
            <i className="material-icons">get_app</i>
          </div>
          <div className="progress">
            <div className="progressbar">
             <div className="progressbar-filled"></div>
            </div>
            <div className="timer">
              <span id="time-elapsed">0:50</span>
              <span id="total-time">1:23:02</span>
            </div>
          </div>
        </div>
        <audio src="https://www.listennotes.com/e/p/b0e5842cfbe44f9c9e3504ae9932d8db/"></audio>
      </div>
    </div>
  )
}

export default AudioPlayer;
