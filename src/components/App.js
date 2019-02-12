import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Home from './Home';
import Search from './Search';
import Podcast from './Podcast';
import Episode from './Episode';
import NotFound from './NotFound';

class App extends React.Component {
  state = {
    hidePlayer: true,
    episodeOnPlay: {},
    playing: false,
    speed: 1,
  };

  handlePlayFromEpisodeCard = (episode, index) => {
    const episodeOnPlay = this.state.episodeOnPlay;
    if (Object.entries(episodeOnPlay).length === 0) {
      this.setState({
        hidePlayer: false
      });
    }
    if (this.state.episodeOnPlay.episodeId !== index) {
      this.setState({
        episodeOnPlay: episode,
        playing: true
      });
    } else {
      this.setState({
        playing: !this.state.playing
      });
    }
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
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Home
                  {...props}

              />)}
            />
            <Route path="/keywords" render={(props) => (
              <Search
                {...props}
                hidePlayer={this.state.hidePlayer}
                episodeOnPlay={this.state.episodeOnPlay}
                speed={this.state.speed}
                playing={this.state.playing}
                onPlay={this.handlePlayFromEpisodeCard}
                onClick={this.updatePlaybackControls}
                onEnded={this.handleEnded}
                removePlayer={this.removePlayer}
            />)} />
            <Route path="/podcastId" render={() => <Podcast />} />
            <Route path="/podcastId/:episodeId" render={() => <Episode />} />
            <Route render={() => <NotFound />} />
          </Switch>
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
