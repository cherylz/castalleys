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
    hideSearchbarResults: true,
    typeaheadPodcasts: [],
    hasMatches: true,
    keywords: '',
    currentFullQuery: '',
    hidePlayer: true,
    episodeOnPlay: {},
    playing: false,
    speed: 1
  };

  componentDidMount() {
    const customColorRef = localStorage.getItem('customColor');
    const hidePlayerRef = localStorage.getItem('hidePlayer');
    const episodeOnPlayRef = localStorage.getItem('episodeOnPlay');
    const speedRef = localStorage.getItem('speed');

    if (customColorRef) {
      document.documentElement.style.setProperty(
        '--custom-color',
        customColorRef
      );
      this.setState({ customColor: customColorRef });
    }

    if (
      hidePlayerRef === 'false' &&
      episodeOnPlayRef !== null &&
      episodeOnPlayRef !== '{}'
    ) {
      this.setState({
        hidePlayer: false,
        episodeOnPlay: JSON.parse(episodeOnPlayRef)
      });
    }

    if (speedRef) {
      this.setState({
        speed: JSON.parse(speedRef)
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (localStorage.getItem('speed') === 'null') {
      localStorage.setItem('speed', this.state.speed);
    }
    if (this.state.speed !== prevState.speed) {
      localStorage.setItem('speed', this.state.speed);
    }
    if (this.state.hidePlayer !== prevState.hidePlayer) {
      localStorage.setItem('hidePlayer', this.state.hidePlayer);
    }
    if (
      !Object.keys(prevState.episodeOnPlay).length &&
      Object.keys(this.state.episodeOnPlay).length
    ) {
      localStorage.setItem(
        'episodeOnPlay',
        JSON.stringify(this.state.episodeOnPlay)
      );
      localStorage.setItem('speed', this.state.speed);
    } else if (
      this.state.episodeOnPlay.episodeId !== prevState.episodeOnPlay.episodeId
    ) {
      localStorage.setItem(
        'episodeOnPlay',
        JSON.stringify(this.state.episodeOnPlay)
      );
    }
  }

  updateCustomColor = customColor => {
    this.setState({ customColor });
  };

  activateSearchbar = () => {
    this.setState({
      hideSearchbarResults: false,
      typeaheadPodcasts: [],
      hasMatches: true
    });
  };

  cleanTypeaheadSearch = () => {
    this.setState({
      hideSearchbarResults: true,
      typeaheadPodcasts: [],
      hasMatches: true
    });
  };

  updateKeywords = keywords => {
    this.setState({ keywords });
  };

  updateTypeaheadSearch = (typeaheadPodcasts, hasMatches) => {
    this.setState({ typeaheadPodcasts, hasMatches });
  };

  resetSearchbar = () => {
    this.setState({
      hideSearchbarResults: true,
      typeaheadPodcasts: [],
      hasMatches: true,
      keywords: '',
      currentFullQuery: ''
    });
  };

  // trigger route change via componentDidUpdate() in Home.js, Search.js, Podcast.js, Episode.js, NotFound.js respectively.
  goToOrUpdateSearchPage = keywords => {
    this.setState({
      keywords,
      currentFullQuery: keywords
    });
  };

  updateEpisodeOnPlay = episode => {
    if (Object.entries(this.state.episodeOnPlay).length === 0) {
      this.setState({
        hidePlayer: false
      });
    }
    this.setState({
      episodeOnPlay: episode,
      playing: true
    });
  };

  updateActualDurationOfEpisodeOnPlay = duration => {
    const episodeOnPlayWithActualDuration = { ...this.state.episodeOnPlay };
    episodeOnPlayWithActualDuration.duration = duration;
    this.setState({
      episodeOnPlay: episodeOnPlayWithActualDuration
    });
  };

  updatePlaying = () => {
    this.setState({
      playing: !this.state.playing
    });
  };

  updatePlaybackControls = userCommand => {
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
  };

  handleEnded = () => {
    this.setState({
      playing: false
    });
  };

  removePlayer = () => {
    this.setState({
      hidePlayer: true,
      episodeOnPlay: {},
      playing: false
    });
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header
            customColor={this.state.customColor}
            hideSearchbarResults={this.state.hideSearchbarResults}
            typeaheadPodcasts={this.state.typeaheadPodcasts}
            keywords={this.state.keywords}
            hasMatches={this.state.hasMatches}
            currentFullQuery={this.state.currentFullQuery}
            activateSearchbar={this.activateSearchbar}
            cleanTypeaheadSearch={this.cleanTypeaheadSearch}
            updateKeywords={this.updateKeywords}
            updateTypeaheadSearch={this.updateTypeaheadSearch}
            goToOrUpdateSearchPage={this.goToOrUpdateSearchPage}
            resetSearchbar={this.resetSearchbar}
            updateCustomColor={this.updateCustomColor}
          />
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  customColor={this.state.customColor}
                />
              )}
            />
            <Route
              path="/search/:keywords"
              render={props => (
                <Search
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                  episodeOnPlayDuration={this.state.episodeOnPlay.duration}
                  playing={this.state.playing}
                  goToOrUpdateSearchPage={this.goToOrUpdateSearchPage}
                  updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                  updateActualDurationOfEpisodeOnPlay={
                    this.updateActualDurationOfEpisodeOnPlay
                  }
                  updatePlaying={this.updatePlaying}
                  resetSearchbar={this.resetSearchbar}
                />
              )}
            />
            <Route
              path="/podcast/:podcastId"
              render={props => (
                <Podcast
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                  episodeOnPlayDuration={this.state.episodeOnPlay.duration}
                  playing={this.state.playing}
                  updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                  updateActualDurationOfEpisodeOnPlay={
                    this.updateActualDurationOfEpisodeOnPlay
                  }
                  updatePlaying={this.updatePlaying}
                />
              )}
            />
            <Route
              path="/episode/:episodeId"
              render={props => (
                <Episode
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                  episodeOnPlayDuration={this.state.episodeOnPlay.duration}
                  playing={this.state.playing}
                  updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                  updateActualDurationOfEpisodeOnPlay={
                    this.updateActualDurationOfEpisodeOnPlay
                  }
                  updatePlaying={this.updatePlaying}
                />
              )}
            />
            <Route
              render={props => (
                <NotFound
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                />
              )}
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
            resetSearchbar={this.resetSearchbar}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
