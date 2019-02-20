import React from 'react';
import { Link } from 'react-router-dom';
import { formatSeconds } from '../helpers';

class AudioPlayer extends React.Component {
  audio = React.createRef();
  progressBar = React.createRef();
  progressBarFilled = React.createRef();
  currentTime = React.createRef();

  updatePlaybackControls = (e) => {
    const audio = this.audio.current;
    if (e.target.id === 'playPause' || e.target.id === 'speed') {
      this.props.onClick(e.target.id);
    } else if (e.target.id === 'replay' || e.target.id === 'forward') {
      audio.currentTime += parseFloat(e.target.dataset.skip);
    }
  }

  scrub = (e) => {
    const audio = this.audio.current;
    const progressBar = this.progressBar.current;
    const scrubTime = (e.nativeEvent.offsetX / progressBar.offsetWidth) * audio.duration; // attention: e.nativeEvent.offsetX instead of e.offsetX because of SyntheticEvent (https://reactjs.org/docs/events.html)
    audio.currentTime = scrubTime;
  }

  updateCurrentTime = () => {
    const audio = this.audio.current;
    const progressBarFilled = this.progressBarFilled.current;
    const currentTime = this.currentTime.current;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBarFilled.style.flexBasis = `${percent}%`;
    currentTime.textContent = formatSeconds(audio.currentTime);
  }

  componentDidUpdate(prevProps) {
    console.log('Props in AudioPlayer.js got updated. Check if it should be handled with care.');
    if (this.props.episodeOnPlay && !this.props.hidePlayer) {
      const audio = this.audio.current;
      const method = this.props.playing ? 'play' : 'pause';
      if (this.props.playing !== prevProps.playing) {
        audio[method]();
      }
      if (this.props.speed !== prevProps.speed) {
        audio.playbackRate = this.props.speed;
      }
    }
  }

  render() {
    console.log('AudioPlayer is rendering. Check if it should be handled with care.');
    const displayAndStyle = this.props.hidePlayer ? 'wrapper hidden' : 'wrapper';
    const speed = this.props.speed;
    const { image, episodeId, podcastId, episodeTitle, podcastTitle, audio, duration } = this.props.episodeOnPlay;
    const togglePlayIcon = this.props.playing ? 'pause' : 'play_arrow';
    let mousedown = false;
    const totalTime = duration; // tbc: duration got from API call doesn't always equal to the actual duration // this could be slow and show NaN at the beginning -> const totalTime = this.audio.current ? formatSeconds(this.audio.current.duration) : duration;
    return (
      <div className={displayAndStyle}>
        <div className="player">
          <div className="episode-info">
            <img className="artwork-in-player" src={image} alt="podcast artwork" />
            <div className="titles-in-player">
              <Link
                to={`/episode/${episodeId}`}
                onClick={this.props.clearInputInHeader}
                className="title1"
              >
                {episodeTitle}
              </Link>
              <br />
              <Link
                to={`/podcast/${podcastId}`}
                onClick={this.props.clearInputInHeader}
                className="title2"
              >
                {podcastTitle}
              </Link>
            </div>
          </div>
          <div className="player-controls">
            <div
              className="main-controls"
              onClick={this.updatePlaybackControls}
            >
              <span id="speed" className="speed">
                {speed}x
              </span>
              <span className="playcontrols">
                <i id="replay" data-skip="-10" className="material-icons custom-color">replay_10</i>
                <i id="playPause" className="material-icons custom-color">{togglePlayIcon}</i>
                <i id="forward" data-skip="10" className="material-icons custom-color">forward_10</i>
              </span>
              <div className="tooltip">
                <i
                  id="remove"
                  className="material-icons"
                  onClick={this.props.removePlayer}
                >
                  delete_outline
                </i>
                <span className="tooltiptext">remove</span>
              </div>
            </div>
            <div className="progress">
              <div
                ref={this.progressBar}
                className="progressbar"
                onClick={this.scrub}
                onMouseMove={(e) => mousedown && this.scrub(e)}
                onMouseDown={() => mousedown = true}
                onMouseUp={() => mousedown = false}
              >
                <div
                  ref={this.progressBarFilled}
                  className="progressbar-filled">
                </div>
              </div>
              <div className="timer">
                <span ref={this.currentTime} id="time-elapsed">--:--:--</span>
                <span id="total-time">{totalTime}</span>
              </div>
            </div>
          </div>
          <audio
            src={audio}
            ref={this.audio}
            onTimeUpdate={this.updateCurrentTime}
            onEnded={this.props.onEnded}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    )
  }
}

export default AudioPlayer;
