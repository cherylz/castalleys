import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import { apiKey } from '../apiKey';
import { formatSeconds, msToDate } from '../helpers';

class Episode extends React.Component {
  state = {
    podcast: {},
    episode: {}
  }

  componentDidMount() {
    const id = this.props.match.params.episodeId;
    if (id.length === 32) {
      const endpoint = `https://api.listennotes.com/api/v1/episodes/${id}`;
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
          const {podcast, ...rest} = data;
          this.setState({
            podcast: podcast,
            episode: rest
          });
        })
        .catch(err => console.log(err));
    } else {
      this.props.history.push(`/404`);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  render() {
    const episode = this.state.episode;
    const podcast = this.state.podcast;
    let renderPodcastInfo;
    let renderEpisodeInfo;
    if (Object.keys(podcast).length) {
      renderPodcastInfo = (
        <PodcastCardStyleA
          podcastOnWhichPage='episode'
          podcast={podcast}
        />
      );
    }
    if (Object.keys(episode).length) {
      const { id:episodeId, image, audio, title:episodeTitle, description:desc } = episode;
      const date = msToDate(episode.pub_date_ms);
      const duration = !audio ?
        '(no audio)' :
        formatSeconds(episode.audio_length);
      const processedEpisode = { episodeTitle, episodeId, image, audio, desc, date, duration };
      renderEpisodeInfo = (
        <EpisodeCardStyleA
          episodeOnWhichPage='episode'
          podcastId={podcast.id}
          podcastTitle={podcast.title}
          episode={processedEpisode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
          updatePlaying={this.props.updatePlaying}
        />
      );
    }
    return (
      <div className="page-container">
        <div className="podcast-episode-container">
          {renderPodcastInfo}
          <div className="episodes">
            {renderEpisodeInfo}
          </div>
        </div>
      </div>
    )
  }
}

export default Episode;
