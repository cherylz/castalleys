import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import { apiKey } from '../apiKey';

class Episode extends React.Component {
  state = {
    podcast: {},
    episode: {}
  }

  componentDidMount() {
    const id = this.props.match.params.episodeId;
    console.log(id);
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
  }

  render() {
    let renderPodcastInfo;
    let renderEpisodeInfo;
    if (Object.keys(this.state.podcast).length) {
      renderPodcastInfo = (
        <PodcastCardStyleA
          podcast={this.state.podcast}
        />
      );
    }
    if (Object.keys(this.state.episode).length) {
      renderEpisodeInfo = (
        <EpisodeCardStyleA
          episodeOnWhichPage='episode'
          podcastId={this.state.podcast.id}
          podcastTitle={this.state.podcast.title}
          episode={this.state.episode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
          updatePlaying={this.props.updatePlaying}
        />
      );
    }
    return (
      <div>
        <div className="page-container">
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
