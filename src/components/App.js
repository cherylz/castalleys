import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Home from './Home';
import StarredPodcasts from './StarredPodcasts';
import FavoriteEpisodes from './FavoriteEpisodes';
import PlayHistory from './PlayHistory';
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
    speed: 1,
    favedEpisodes: [],
    playHistory: []
  };

  componentDidMount() {
    const customColorRef = localStorage.getItem('customColor');
    const hidePlayerRef = localStorage.getItem('hidePlayer');
    const episodeOnPlayRef = localStorage.getItem('episodeOnPlay');
    const speedRef = localStorage.getItem('speed');
    const favedEpisodesRef = localStorage.getItem('favedEpisodes');
    const playHistoryRef = localStorage.getItem('playHistory');

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

    if (favedEpisodesRef && favedEpisodesRef !== '[]') {
      this.setState({
        favedEpisodes: JSON.parse(favedEpisodesRef)
      });
    }

    if (playHistoryRef && playHistoryRef !== '[]') {
      this.setState({
        playHistory: JSON.parse(playHistoryRef)
      });
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

  // update the episode on play and the actual duration of the episode if audioRef.current.duration of the relevant child component doesn't return NaN for unknown reasons
  updateEpisodeOnPlay = episode => {
    if (Object.entries(this.state.episodeOnPlay).length === 0) {
      this.setState({ hidePlayer: false });
      localStorage.setItem('hidePlayer', 'false');
    }
    this.setState({
      episodeOnPlay: episode,
      playing: true
    });
    localStorage.setItem('episodeOnPlay', JSON.stringify(episode));
    localStorage.setItem('speed', this.state.speed);
    // also update the actual duration in favedEpisodes if the episode is a fav-ed episode
    const favedEpisodesIds = this.state.favedEpisodes.map(
      item => item.episodeId
    );
    const episodeOnPlayIsFaved =
      favedEpisodesIds.indexOf(episode.episodeId) !== -1;
    if (episodeOnPlayIsFaved) {
      const updated = this.state.favedEpisodes.map(
        item =>
          item.episodeId === episode.episodeId
            ? { ...item, duration: episode.duration }
            : item
      );
      this.setState({ favedEpisodes: updated });
      localStorage.setItem('favedEpisodes', JSON.stringify(updated));
    }
    // no need to update the actual duration in playHistory because playHistory will be set to match the updated episodeOnPlay in addToPlayHistory()
  };

  // fallback: update the actual duration of the episode if audioRef.current.duration of the relevant child component returned NaN for unknown reasons on first click
  updateActualDurationOfEpisodeOnPlay = duration => {
    const episodeOnPlay = { ...this.state.episodeOnPlay, duration };
    this.setState({ episodeOnPlay });
    localStorage.setItem('episodeOnPlay', JSON.stringify(episodeOnPlay));
    // also update the actual duration in favedEpisodes if the episode is a fav-ed episode
    const updated = this.state.favedEpisodes.map(
      item =>
        item.episodeId === this.state.episodeOnPlay.episodeId
          ? { ...item, duration }
          : item
    );
    this.setState({ favedEpisodes: updated });
    localStorage.setItem('favedEpisodes', JSON.stringify(updated));
    // also update the actual duration in playHistory
    const updatedPlayHistory = this.state.playHistory.map(
      item =>
        item.episodeId === this.state.episodeOnPlay.episodeId
          ? { ...item, duration }
          : item
    );
    this.setState({ playHistory: updatedPlayHistory });
    localStorage.setItem('playHistory', JSON.stringify(updatedPlayHistory));
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
        const speed = this.state.speed + 0.25;
        this.setState({ speed });
        localStorage.setItem('speed', speed);
      } else if (this.state.speed === 2) {
        this.setState({ speed: 0.5 });
        localStorage.setItem('speed', 0.5);
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
    localStorage.removeItem('episodeOnPlay');
    localStorage.setItem('hidePlayer', 'true');
  };

  addFavedEpisode = episode => {
    const updated = [...this.state.favedEpisodes, episode];
    this.setState({ favedEpisodes: updated });
    localStorage.setItem('favedEpisodes', JSON.stringify(updated));
  };

  removeFavedEpisode = id => {
    const updated = this.state.favedEpisodes.filter(
      item => item.episodeId !== id
    );
    this.setState({ favedEpisodes: updated });
    localStorage.setItem('favedEpisodes', JSON.stringify(updated));
  };

  addToPlayHistory = () => {
    const addToHistory = { ...this.state.episodeOnPlay, timePlayed: 0 };
    const updated = [...this.state.playHistory, addToHistory];
    this.setState({ playHistory: updated });
    localStorage.setItem('playHistory', JSON.stringify(updated));
  };

  updateTimePlayed = timePlayed => {
    const updated = this.state.playHistory.map(
      item =>
        item.episodeId === this.state.episodeOnPlay.episodeId
          ? { ...item, timePlayed }
          : item
    );
    this.setState({ playHistory: updated });
    localStorage.setItem('playHistory', JSON.stringify(updated));
  };

  removeFromHistory = id => {
    const updated = this.state.playHistory.filter(
      item => item.episodeId !== id
    );
    this.setState({ playHistory: updated });
    localStorage.setItem('playHistory', JSON.stringify(updated));
  };

  render() {
    const favedEpisodesIds = this.state.favedEpisodes.map(
      item => item.episodeId
    );
    const episodeOnPlayIsFaved =
      favedEpisodesIds.indexOf(this.state.episodeOnPlay.episodeId) !== -1;
    const playedIds = this.state.playHistory.map(item => item.episodeId);
    const episodeOnPlayWasPlayed =
      playedIds.indexOf(this.state.episodeOnPlay.episodeId) !== -1;
    const episodeOnPlayStartTime = episodeOnPlayWasPlayed
      ? this.state.playHistory.filter(
          item => item.episodeId === this.state.episodeOnPlay.episodeId
        )[0].timePlayed
      : 0;
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
                  hidePlayer={this.state.hidePlayer}
                />
              )}
            />
            <Route
              path="/me/starred-podcasts"
              render={props => (
                <StarredPodcasts
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  customColor={this.state.customColor}
                />
              )}
            />
            <Route
              path="/me/favorite-episodes"
              render={props => (
                <FavoriteEpisodes
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  customColor={this.state.customColor}
                  episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                  playing={this.state.playing}
                  updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                  updateActualDurationOfEpisodeOnPlay={
                    this.updateActualDurationOfEpisodeOnPlay
                  }
                  updatePlaying={this.updatePlaying}
                  favedEpisodes={this.state.favedEpisodes}
                  removeFavedEpisode={this.removeFavedEpisode}
                />
              )}
            />
            <Route
              path="/me/play-history"
              render={props => (
                <PlayHistory
                  {...props}
                  currentFullQuery={this.state.currentFullQuery}
                  customColor={this.state.customColor}
                  episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                  playing={this.state.playing}
                  updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                  updateActualDurationOfEpisodeOnPlay={
                    this.updateActualDurationOfEpisodeOnPlay
                  }
                  updatePlaying={this.updatePlaying}
                  favedEpisodesIds={favedEpisodesIds}
                  addFavedEpisode={this.addFavedEpisode}
                  removeFavedEpisode={this.removeFavedEpisode}
                  playHistory={this.state.playHistory}
                  removeFromHistory={this.removeFromHistory}
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
                  customColor={this.state.customColor}
                  goToOrUpdateSearchPage={this.goToOrUpdateSearchPage}
                  updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                  updateActualDurationOfEpisodeOnPlay={
                    this.updateActualDurationOfEpisodeOnPlay
                  }
                  updatePlaying={this.updatePlaying}
                  resetSearchbar={this.resetSearchbar}
                  favedEpisodesIds={favedEpisodesIds}
                  addFavedEpisode={this.addFavedEpisode}
                  removeFavedEpisode={this.removeFavedEpisode}
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
                  customColor={this.state.customColor}
                  favedEpisodesIds={favedEpisodesIds}
                  addFavedEpisode={this.addFavedEpisode}
                  removeFavedEpisode={this.removeFavedEpisode}
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
                  customColor={this.state.customColor}
                  favedEpisodesIds={favedEpisodesIds}
                  addFavedEpisode={this.addFavedEpisode}
                  removeFavedEpisode={this.removeFavedEpisode}
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
            episodeOnPlayIsFaved={episodeOnPlayIsFaved}
            addFavedEpisode={this.addFavedEpisode}
            removeFavedEpisode={this.removeFavedEpisode}
            episodeOnPlayWasPlayed={episodeOnPlayWasPlayed}
            episodeOnPlayStartTime={episodeOnPlayStartTime}
            addToPlayHistory={this.addToPlayHistory}
            updateTimePlayed={this.updateTimePlayed}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
