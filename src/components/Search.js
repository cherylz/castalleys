import React from 'react';
import PodcastCardStyleC from './PodcastCardStyleC';
import EpisodeCardStyleB from './EpisodeCardStyleB';
// import { typeaheadPodcasts, fullSearchPodcasts, fullSearchEpisodes } from '../sample-responses';
import { apiKey } from '../apiKey';

class Search extends React.Component {
  state = {
    fullSearchPodcasts: [],
    fullSearchEpisodes: [],
    fliter: 'episodes',
    calledFullSearchEpisodes: false,
    calledFullSearchPodcasts: false
  };

  callFullSearchEpisodes = (keywords) => {
    console.log('calling api to search episodes');
    console.log(keywords);
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=0&safe_mode=1&q=%22${keywords}%22`;
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
        this.setState({
          fullSearchEpisodes: [...data.results],
          calledFullSearchEpisodes: true
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    console.log('i mounted');
    const keywords = this.props.match.params.keywords;
    this.callFullSearchEpisodes(keywords);
    this.props.goToOrUpdateSearchPage(keywords);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
      this.setState({
        fullSearchPodcasts: [],
        fullSearchEpisodes: [],
        fliter: 'episodes',
        calledFullSearchEpisodes: false,
        calledFullSearchPodcasts: false
      });
      console.log('new full search in the same Search component');
      this.callFullSearchEpisodes(this.props.currentFullQuery);
    }
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
      if (!this.state.calledFullSearchPodcasts) {
        const keywords = this.props.currentFullQuery;
        const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=podcast&offset=0&safe_mode=1&q=%22${keywords}%22`;
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
            this.setState({
              fullSearchPodcasts: [...data.results],
              calledFullSearchPodcasts: true
            });
          })
          .catch(err => console.log(err));
      }
    }
  }

  render() {
    const fullSearchEpisodes = this.state.fullSearchEpisodes;
    const fullSearchPodcasts = this.state.fullSearchPodcasts;
    let renderEpisodes;
    let renderPodcasts;

    if (fullSearchEpisodes.length) {
      renderEpisodes = fullSearchEpisodes.map((episode) => (
        <EpisodeCardStyleB
          key={episode.id}
          episode={episode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
          updatePlaying={this.props.updatePlaying}
          clearInputInHeader={this.props.clearInputInHeader}
        />
      ));
    } else if (this.state.calledFullSearchEpisodes) {
      renderEpisodes = (<div className="no-match-prompt">Oops... No matched results found.</div>);
    }

    if (fullSearchPodcasts.length) {
      renderPodcasts = fullSearchPodcasts.map((match) => (
        <PodcastCardStyleC
          podcast={match}
          key={match.id}
          clearInputInHeader={this.props.clearInputInHeader}
        />
      ));
    } else if (this.state.calledFullSearchPodcasts) {
      renderPodcasts = (<div className="no-match-prompt">Oops... No matched results found.</div>);
    }

    const matches = this.state.fliter === 'episodes' ?  renderEpisodes : renderPodcasts;
    const episodesActive = this.state.fliter === 'episodes' ? 'active' : '';
    const podcastsActive = this.state.fliter === 'episodes' ? '' : 'active';
    return (
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
    )
  }
}

export default Search;
