import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Header from './Header';
import AudioPlayer from './AudioPlayer';
import Home from './Home';
import Search from './Search';
import Podcast from './Podcast';
import Episode from './Episode';
import NotFound from './NotFound';
import { apiKey } from '../apiKey';

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

  updateKeywords = (keywords) => {
    this.setState({ keywords });
  }

  clearInputInHeader = () => {
    this.setState({
      keywords: ''
    });
  }

  goToFullSearchEpisodes = (keywords) => {
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
            onEnterKeyUp={this.goToFullSearchEpisodes}
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
              />)}
            />
            <Route path="/podcast/:podcastId" render={(props) => (
              <Podcast
                {...props}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
              />)}
            />
            <Route path="/episode/:episodeId" render={(props) => (
              <Episode
                {...props}
                episodeOnPlayId={this.state.episodeOnPlay.episodeId}
                playing={this.state.playing}
                updateEpisodeOnPlay={this.updateEpisodeOnPlay}
                updatePlaying={this.updatePlaying}
              />)}
            />
            <Route render={() => <NotFound />} />
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

/*
return (
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/"
        component={() => <Search
        />}
      />
      <Route path="/keyword" component={Home} />
      <Route path="/podcastId" component={Podcast} />
      <Route path="/podcastId/:episodeId" component={Episode} />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)
*/
