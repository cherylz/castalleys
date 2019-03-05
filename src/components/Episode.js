import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import { apiKey } from '../apiKey';
import { formatSeconds, msToDate } from '../helpers';

class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
  }

  state = {
    podcast: {},
    episode: {}
  };

  componentDidMount() {
    const id = this.props.match.params.episodeId;
    if (id.length === 32) {
      const endpoint = `https://api.listennotes.com/api/v1/episodes/${id}`;
      const request = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          Accept: 'application/json'
        }
      };
      this.fetchData(endpoint, request);
    } else {
      this.props.history.push(`/404`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // handle a marginal case: update the actual duration of an episode if that episode happens to be the one stored in local storage
    if (!Object.keys(prevState.episode).length && this.props.episodeOnPlayId) {
      if (this.state.episode.id === this.props.episodeOnPlayId) {
        const episodeWithActualDuration = { ...this.state.episode };
        episodeWithActualDuration.duration = this.props.episodeOnPlayDuration;
        this.setState({
          episode: episodeWithActualDuration
        });
      }
    }
    // handle new full search of episodes in the search bar of Header.js while the user is on Episode page and presses the return key
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  // notes to developers: here is the only place in this project that async/await is used for demo purpose. instead, promises is used to handle most of the api requests in this project. while i understand async/await is neat with solid reasons, in this particular case, i chose promises because with promises, i don't have to bind `this` in a constructor.
  async fetchData(endpoint, request) {
    try {
      const res = await fetch(endpoint, request);
      const data = await res.json();
      const { podcast, ...rest } = data;
      const processedEpisode = { ...rest };
      delete processedEpisode.audio_length;
      delete processedEpisode.pub_date_ms;
      processedEpisode.duration = rest.audio
        ? formatSeconds(rest.audio_length)
        : '(no audio)';
      processedEpisode.date = msToDate(rest.pub_date_ms);
      this.setState({
        podcast: podcast,
        episode: processedEpisode
      });
    } catch (err) {
      console.error(err);
    }
  }

  updateEpisodeOnPlayAndMaybeActualDuration = episode => {
    // Step 1: update the actual duration of the episode on play in this.state.episode
    const episodeWithActualDuration = { ...this.state.episode };
    episodeWithActualDuration.duration = episode.duration;
    this.setState({
      episode: episodeWithActualDuration
    });
    // Step 2: update the episode on play with actual duration in this.state.epsidoeOnDisplay of App.js
    this.props.updateEpisodeOnPlay(episode);
  };

  updateActualDuration = duration => {
    // the duration passed in is in HH:MM:SS format
    const episodeWithActualDuration = { ...this.state.episode };
    episodeWithActualDuration.duration = duration;
    this.setState({
      episode: episodeWithActualDuration
    });
    this.props.updateActualDurationOfEpisodeOnPlay(duration);
  };

  render() {
    const episode = this.state.episode;
    const podcast = this.state.podcast;
    let renderPodcastInfo;
    let renderEpisodeInfo;
    let loadingPromptWhenNeeded = (
      <div className="loading-prompt">
        Loading... Good things are worth waiting for :)
      </div>
    );

    if (Object.keys(podcast).length) {
      loadingPromptWhenNeeded = '';
      renderPodcastInfo = (
        <PodcastCardStyleA podcastOnWhichPage="episode" podcast={podcast} />
      );
    }

    if (Object.keys(episode).length) {
      const {
        title: episodeTitle,
        id: episodeId,
        description: desc,
        image,
        audio,
        date,
        duration
      } = episode;
      const processedEpisode = {
        episodeTitle,
        episodeId,
        desc,
        image,
        audio,
        date,
        duration
      };
      renderEpisodeInfo = (
        <EpisodeCardStyleA
          episodeOnWhichPage="episode"
          podcastId={podcast.id}
          podcastTitle={podcast.title}
          episode={processedEpisode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlayAndMaybeActualDuration={
            this.updateEpisodeOnPlayAndMaybeActualDuration
          }
          updateActualDuration={this.updateActualDuration}
          updatePlaying={this.props.updatePlaying}
        />
      );
    }

    return (
      <div className="page-container">
        <div className="podcast-episode-container">
          {renderPodcastInfo}
          <div className="episodes">{renderEpisodeInfo}</div>
        </div>
        {loadingPromptWhenNeeded}
      </div>
    );
  }
}

export default Episode;
