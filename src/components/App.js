import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Home from './Home';
import Search from './Search';
import Podcast from './Podcast';
import Episode from './Episode';
import NotFound from './NotFound';

class App extends React.Component {
  state = {
    customColor: '#ce0925',
    keywords: '',
    currentFullQuery: '',
    hidePlayer: true,
    episodeOnPlay: {},
    playing: false,
    speed: 1
  };

  componentDidMount() {
    const hidePlayerRef = JSON.parse(localStorage.getItem('hidePlayer'));
    const episodeOnPlayRef = JSON.parse(localStorage.getItem('episodeOnPlay'));
    const customColorRef = localStorage.getItem('customColor');
    document.documentElement.style.setProperty('--custom-color', localStorage.getItem('customColor'));
    if (customColorRef) {
      this.setState({
        customColor: localStorage.getItem('customColor')
      });
    }
    if (!hidePlayerRef && localStorage.getItem('episodeOnPlay')) {
      this.setState({
        hidePlayer: false,
        episodeOnPlay: episodeOnPlayRef,
        speed: JSON.parse(localStorage.getItem('speed')) || 1
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate in App.js');
    if (localStorage.getItem('speed') === 'null') {
      localStorage.setItem('speed', this.state.speed);
    }
    if (this.state.speed !== prevState.speed) {
      localStorage.setItem('speed', this.state.speed);
    }
    if (this.state.hidePlayer !== prevState.hidePlayer) {
      localStorage.setItem('hidePlayer', this.state.hidePlayer);
    }
    if (!Object.keys(prevState.episodeOnPlay).length) {
      localStorage.setItem('episodeOnPlay', JSON.stringify(this.state.episodeOnPlay));
    } else if (this.state.episodeOnPlay.episodeId !== prevState.episodeOnPlay.episodeId) {
      localStorage.setItem('episodeOnPlay', JSON.stringify(this.state.episodeOnPlay));
    }
  }

  updateCustomColor = (customColor) => {
    this.setState({ customColor });
  }

  updateKeywords = (keywords) => {
    this.setState({ keywords });
  }

  clearInputInHeader = () => {
    if (this.state.keywords) {
      this.setState({
        keywords: ''
      });
    }
  }

  goToOrUpdateSearchPage = (keywords) => {
    this.setState({
      currentFullQuery: keywords
    });
  }
  // TBC: check if it is correct: this will trigger route change via componentDidUpdate() in Home.js, Search.js, Podcast.js, Episode.js, 404.js respectively.

  updateEpisodeOnPlay = (episode) => {
    if (Object.entries(this.state.episodeOnPlay).length === 0) {
      this.setState({
        hidePlayer: false
      });
    }
    this.setState({
      episodeOnPlay: episode,
      playing: true
    });
  }

  updatePlaying = () => {
    this.setState({
      playing: !this.state.playing
    });
  }

  updatePlaybackControls = (userCommand) => {
    if (userCommand === 'playPause') {
      this.setState({
        playing: !this.state.playing
      });
    } else if (userCommand === 'speed') {
      if (this.state.speed < 2) {
        this.setState({
          speed: this.state.speed + 0.25
        });
      } else if (this.state.speed === 2) {
        this.setState({
          speed: 0.5
        });
      }
    }
  }

  handleEnded = () => {
    this.setState({
      playing: false
    });
  }

  removePlayer = () => {
    this.setState({
      hidePlayer: true,
      episodeOnPlay: {},
      playing: false
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header
            keywords={this.state.keywords}
            currentFullQuery={this.state.currentFullQuery}
            customColor={this.state.customColor}
            updateCustomColor={this.updateCustomColor}
            updateKeywords={this.updateKeywords}
            goToOrUpdateSearchPage={this.goToOrUpdateSearchPage}
            clearInputInHeader={this.clearInputInHeader}
          />
          <Switch>
            <Route exact path="/" render={(props) => (
              <Home
                {...props}
                currentFullQuery={this.state.currentFullQuery}
                customColor={this.state.customColor}
              />)}
            />
            <Route path="/search/:keywords" render={(props) => (
              <Search
                {...props}
                currentFullQuery={this.state.currentFullQuery}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                goToOrUpdateSearchPage={this.goToOrUpdateSearchPage}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
                clearInputInHeader={this.clearInputInHeader}
              />)}
            />
            <Route path="/podcast/:podcastId" render={(props) => (
              <Podcast
                {...props}
                currentFullQuery={this.state.currentFullQuery}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
              />)}
            />
            <Route path="/episode/:episodeId" render={(props) => (
              <Episode
                {...props}
                currentFullQuery={this.state.currentFullQuery}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
              />)}
            />
            <Route render={(props) => (
              <NotFound
                {...props}
                currentFullQuery={this.state.currentFullQuery}
              />)}
            />
          </Switch>
          <AudioPlayer
            hidePlayer={this.state.hidePlayer}
            episodeOnPlay={this.state.episodeOnPlay}
            playing={this.state.playing}
            speed={this.state.speed}
            customColor={this.state.customColor}
            onClick={this.updatePlaybackControls}
            removePlayer={this.removePlayer}
            onEnded={this.handleEnded}
            clearInputInHeader={this.clearInputInHeader}
          />
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
