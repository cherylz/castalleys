import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import EpisodeCardStyleC from './EpisodeCardStyleC';
import { apiKey } from '../apiKey';
import { formatSeconds } from '../helpers';

class Podcast extends React.Component {
  state = {
    podcast: {},
    episodes: [],
    query: '',
    matchedEpisodes: [],
    searchingInPodcast: false
  }
  // TBC: if in the end, it's decided that we do not highlight in the search result, then move query from here down to PodcastCardStyleA.js

  updateQueryAndMatchedResults = (keywords, episodes) => {
    this.setState({
      query: keywords,
      matchedEpisodes: episodes,
      searchingInPodcast: true
    });
  }

  resetSearch = () => {
    this.setState({
      query: '',
      matchedEpisodes: [],
      searchingInPodcast: false
    });
  }

  componentDidMount() {
    const id = this.props.match.params.podcastId;
    if (id.length === 32) {
      const endpoint = `https://api.listennotes.com/api/v1/podcasts/${id}?sort=recent_first`;
      const request = {
        method: 'GET',
        headers: {
          "X-RapidAPI-Key": apiKey,
          "Accept": "application/json"
        }
      };
      fetch(endpoint, request)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          const {episodes, ...rest} = data;
          this.setState({
            podcast: rest,
            episodes: episodes
          });
        })
        .catch(err => console.log(err));
    } else {
      this.props.history.push(`/404`);
    }
  }

  componentDidUpdate() {
    if (this.props.previousFullQuery !== this.props.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
      this.props.updatePreviousFullQuery();
    }
  }

  /*
  componentDidUpdate(prevProps) {
    if (prevProps.currentFullQuery !== this.props.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
      this.props.updatePreviousFullQuery();
    }
  }
  */

  render() {
    let renderPodcastInfo;
    let renderEpisodesInfo;
    if (Object.keys(this.state.podcast).length) {
      renderPodcastInfo = (
        <PodcastCardStyleA
          podcastOnWhichPage='podcast'
          podcast={this.state.podcast}
          query={this.state.query}
          updateQueryAndMatchedResults={this.updateQueryAndMatchedResults}
          resetSearch={this.resetSearch}
        />
      );
    }
    if (!this.state.searchingInPodcast && this.state.episodes.length) {
      renderEpisodesInfo = this.state.episodes.map((episode) => {
        const { title:episodeTitle, id:episodeId, description:desc, image, audio } = episode;
        const date = new Date(episode.pub_date_ms).toDateString();
        const duration = audio ? formatSeconds(episode.audio_length) : '(no audio)';
        const processedEpisode = { episodeTitle, episodeId, desc, image, audio, date, duration };
        return (
          <EpisodeCardStyleA
            key={episode.id}
            episodeOnWhichPage='podcast'
            podcastId={this.state.podcast.id}
            podcastTitle={this.state.podcast.title}
            episode={processedEpisode}
            episodeOnPlayId={this.props.episodeOnPlayId}
            playing={this.props.playing}
            updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
            updatePlaying={this.props.updatePlaying}
          />
        );
      });
    } else if (this.state.searchingInPodcast && this.state.matchedEpisodes.length) {
      renderEpisodesInfo = this.state.matchedEpisodes.map((episode) => (
        <EpisodeCardStyleC
          key={episode.id}
          episode={episode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
          updatePlaying={this.props.updatePlaying}
        />
      ));
    } else if (this.state.searchingInPodcast && !this.state.matchedEpisodes.length) {
      renderEpisodesInfo = (<div className="no-match-prompt">Oops... No matched results found.</div>);
    }
    return (
      <div className="page-container">
        <div className="podcast-episode-container">
          {renderPodcastInfo}
          <div className="episodes">
            {renderEpisodesInfo}
          </div>
        </div>
      </div>
    )
  }
}

export default Podcast;
