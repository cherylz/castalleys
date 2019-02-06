import React from 'react';
import Header from './Header';
// import PodcastCardStyleC from './PodcastCardStyleC';
//import EpisodeCardStyleB from './EpisodeCardStyleB';
import AudioPlayer from './AudioPlayer';
import { typeaheadPodcast, searchPodcasts, searchEpisodes } from '../sample-responses';

class Search extends React.Component {

  render() {
    const podcasts = [...typeaheadPodcast.podcasts];
    // const podcastsFullSearch = [...searchPodcasts.results];

    return (
      <div>
        <Header
          matchedPodcasts={podcasts}
        />
        <div className="page-container">
          <div className="matched-container2">
            <div className="filter">
              <button
                className="active"
              >
                Episodes
              </button>
              <span>/</span>
              <button>
                Podcasts
              </button>
            </div>
            <div className="matched-results">
            </div>
          </div>
        </div>
        <AudioPlayer />
      </div>
    )
  }
}

export default Search;
