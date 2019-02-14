import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import { apiKey } from '../apiKey';

class Podcast extends React.Component {
  state = {
    podcast: {},
    episodes: []
  }

  componentDidMount() {
    // const id = this.props.history.location.id;
    const id = this.props.match.params.podcastId;
    console.log(id);
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
  }

  render() {
    let renderPodcastInfo;
    let renderEpisodesInfo;
    if (Object.keys(this.state.podcast).length) {
      renderPodcastInfo = (
        <PodcastCardStyleA
          podcast={this.state.podcast}
          podcastOnWhichPage='podcast'
        />
      );
    }
    if (this.state.episodes.length) {
      renderEpisodesInfo = this.state.episodes.map((episode) => (
        <EpisodeCardStyleA
          key={episode.id}
          episodeOnWhichPage='podcast'
          podcastId={this.state.podcast.id}
          podcastTitle={this.state.podcast.title}
          episode={episode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
          updatePlaying={this.props.updatePlaying}
        />
      ));
    }
    return (
      <div>
        <div className="page-container">
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
