import React from 'react';
import Header from './Header';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import AudioPlayer from './AudioPlayer';

class Podcast extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <div className="page-container">
          <PodcastCardStyleA />
          <div className="episodes">
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
            <EpisodeCardStyleA />
          </div>
        </div>
        <AudioPlayer />
      </div>
    )
  }
}

export default Podcast;
