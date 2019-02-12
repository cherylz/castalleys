import React from 'react';
import Header from './Header';
import PodcastCardStyleC from './PodcastCardStyleC';
import EpisodeCardStyleB from './EpisodeCardStyleB';
import AudioPlayer from './AudioPlayer';
// import { typeaheadPodcasts, fullSearchPodcasts, fullSearchEpisodes } from '../sample-responses';
import { apiKey } from '../apiKey';

class Search extends React.Component {
  state = {
    keywords: '',
    hideSearchbarResults: true,
    typeaheadPodcasts: [],
    fullSearchPodcasts: [],
    fullSearchEpisodes: [],
    fliter: 'episodes',
  };

  // TBC: go to router url with keyword value passed, re-render everything
  handleEnterKeyUp = (keywords) => {
    console.log('handle enterkey up');
    this.setState({
      fullSearchPodcasts: [],
      fullSearchEpisodes: []
    });
    const endpoint = `https://listennotes.p.mashape.com/api/v1/search?q=%22${keywords}%22&genre_ids&type=episode&language&len_max&len_min&ncid&ocid&offset&only_in&published_after&published_before&sort_by_date=0`;
    const request = {
      method: 'GET',
      headers: {
          "X-Mashape-Key": apiKey,
          "Accept": "application/json",
      }
    };
    fetch(endpoint, request)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          hideSearchbarResults: true,
          typeaheadPodcasts: [],
          fliter: 'episodes',
          fullSearchEpisodes: [...data.results]
        });
      })
      .catch(err => console.log(err));
  }

  handleKeywordsChange = (keywords) => {
    if (keywords) {
      this.setState({
        keywords: keywords,
        hideSearchbarResults: false,
        // typeaheadPodcasts: [...typeaheadPodcasts.podcasts]
      });
    } else {
      this.setState({
        keywords: keywords,
        hideSearchbarResults: true,
        typeaheadPodcasts: []
      });

    }
  }

  updateSearchbarResults = (data) => {
    this.setState({
      typeaheadPodcasts: [...data.podcasts]
    });
  }

  handleFilterChange = (e) => {
    if (e.target.id === "episodes") {
      this.setState({
        fliter: 'episodes'
      });
    } else {
      this.setState({
        fliter: 'podcasts'
      });
      if (!this.state.fullSearchPodcasts.length) {
        const endpoint = `https://listennotes.p.mashape.com/api/v1/search?q=%22${this.state.keywords}%22&genre_ids&type=podcast&language&len_max&len_min&ncid&ocid&offset&only_in&published_after&published_before&sort_by_date=0`;
        const request = {
          method: 'GET',
          headers: {
              "X-Mashape-Key": apiKey,
              "Accept": "application/json",
          }
        };
        fetch(endpoint, request)
          .then(res => res.json())
          .then(data => {
            console.log(data);
            this.setState({
              fullSearchPodcasts: [...data.results]
            });
          })
          .catch(err => console.log(err));
      }
    }
  }

  render() {
    const typeaheadPodcasts = this.state.typeaheadPodcasts;
    const fullSearchPodcasts = this.state.fullSearchPodcasts;
    const fullSearchEpisodes = this.state.fullSearchEpisodes;
    const renderEpisodes = fullSearchEpisodes.map((match) => (
      <EpisodeCardStyleB
        keywords={this.state.keywords}
        episode={match}
        key={match.id}
        index={match.id}
        episodeOnPlayId={this.props.episodeOnPlay.episodeId}
        updateEpisodeOnPlay={this.props.onPlay}
        playing={this.props.playing}
      />
    ));
    const renderPodcasts = fullSearchPodcasts.map((match) => (
      <PodcastCardStyleC
        podcast={match}
        key={match.id}
      />
    ));
    const matches = this.state.fliter === 'episodes' ?  renderEpisodes : renderPodcasts;
    const episodesActive = this.state.fliter === 'episodes' ? 'active' : '';
    const podcastsActive = this.state.fliter === 'episodes' ? '' : 'active';
    return (
      <div>
        <Header
          matchedPodcasts={typeaheadPodcasts}
          hideSearchbarResults={this.state.hideSearchbarResults}
          keywords={this.state.keywords}
          onKeywordsChange={this.handleKeywordsChange}
          onKeyUp={this.handleEnterKeyUp}
          updateSearchbarResults={this.updateSearchbarResults}
        />
        <div className="page-container">
          <div className="matched-container2">
            <div className="filter">
              <button
                id="episodes"
                className={episodesActive}
                onClick={this.handleFilterChange}
              >
                Episodes
              </button>
              <span>/</span>
              <button
                id="podcasts"
                className={podcastsActive}
                onClick={this.handleFilterChange}
              >
                Podcasts
              </button>
            </div>
            <div className="matched-results">
              {matches}
            </div>
          </div>
        </div>
        <AudioPlayer
          hidePlayer={this.props.hidePlayer}
          audioDetails={this.props.episodeOnPlay}
          playing={this.props.playing}
          speed={this.props.speed}
          onClick={this.props.onClick}
          removePlayer={this.props.removePlayer}
          onEnded={this.props.onEnded}
        />
      </div>
    )
  }
}

export default Search;
