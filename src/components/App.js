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
    keywords: '',
    previousFullQuery: '',
    currentFullQuery: '',
    hidePlayer: true,
    episodeOnPlay: {},
    playing: false,
    speed: 1,
  };

  componentDidMount() {
    const hidePlayerRef = JSON.parse(localStorage.getItem('hidePlayer'));
    const episodeOnPlayRef = JSON.parse(localStorage.getItem('episodeOnPlay'));
    document.documentElement.style.setProperty('--custom-color', localStorage.getItem('customColor'));
    if (!hidePlayerRef && localStorage.getItem('episodeOnPlay')) {
      this.setState({
        hidePlayer: false,
        episodeOnPlay: episodeOnPlayRef,
        speed: JSON.parse(localStorage.getItem('speed'))
      });
    }
  }

  componentDidUpdate(prevState) {
    if (this.state.speed !== prevState.speed || this.state.hidePlayer !== prevState.hidePlayer || this.state.episodeOnPlay.episodeId !== prevState.episodeOnPlay.episodeId) {
      localStorage.setItem('episodeOnPlay', JSON.stringify(this.state.episodeOnPlay));
      localStorage.setItem('speed', this.state.speed);
      localStorage.setItem('hidePlayer', this.state.hidePlayer);
    }
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

  updatePreviousFullQuery = () => {
    this.setState({
      previousFullQuery: this.state.currentFullQuery
    });
  }

  updateKeywordsAndQueries = (keywords) => {
    this.setState({
      keywords: keywords,
      currentFullQuery: keywords,
      previousFullQuery: keywords
    });
  }

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
            updateKeywords={this.updateKeywords}
            goToOrUpdateSearchPage={this.goToOrUpdateSearchPage}
            clearInputInHeader={this.clearInputInHeader}
          />
          <Switch>
            <Route exact path="/" render={(props) => (
              <Home
                {...props}
                previousFullQuery={this.state.previousFullQuery}
                currentFullQuery={this.state.currentFullQuery}
                updatePreviousFullQuery={this.updatePreviousFullQuery}
              />)}
            />
            <Route path="/search/:keywords" render={(props) => (
              <Search
                {...props}
                previousFullQuery={this.state.previousFullQuery}
                currentFullQuery={this.state.currentFullQuery}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateKeywordsAndQueries={this.updateKeywordsAndQueries}
                updatePreviousFullQuery={this.updatePreviousFullQuery}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
                clearInputInHeader={this.clearInputInHeader}
              />)}
            />
            <Route path="/podcast/:podcastId" render={(props) => (
              <Podcast
                {...props}
                previousFullQuery={this.state.previousFullQuery}
                currentFullQuery={this.state.currentFullQuery}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
                updatePreviousFullQuery={this.updatePreviousFullQuery}
              />)}
            />
            <Route path="/episode/:episodeId" render={(props) => (
              <Episode
                {...props}
                previousFullQuery={this.state.previousFullQuery}
                currentFullQuery={this.state.currentFullQuery}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
                updatePreviousFullQuery={this.updatePreviousFullQuery}
              />)}
            />
            <Route render={(props) => (
              <NotFound
                {...props}
                previousFullQuery={this.state.previousFullQuery}
                currentFullQuery={this.state.currentFullQuery}
                updatePreviousFullQuery={this.updatePreviousFullQuery}
              />)}
            />
          </Switch>
          <AudioPlayer
            hidePlayer={this.state.hidePlayer}
            episodeOnPlay={this.state.episodeOnPlay}
            playing={this.state.playing}
            speed={this.state.speed}
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
