import React from 'react';
import PodcastCardStyleC from './PodcastCardStyleC';
import EpisodeCardStyleB from './EpisodeCardStyleB';
// import { typeaheadPodcasts, fullSearchPodcasts, fullSearchEpisodes } from '../sample-responses';
import { apiKey } from '../apiKey';

class Search extends React.Component {
  state = {
    fullSearchPodcasts: [],
    fullSearchEpisodes: [],
    offsetEpisodes: 0,
    totalEpisodeMatches: 0,
    offsetPodcasts: 0,
    totalPodcastMatches: 0,
    fliter: 'episodes',
    calledFullSearchEpisodes: false,
    calledFullSearchPodcasts: false
  };

  loadMoreMatches = () => {
    if (this.state.fliter === 'episodes' && this.state.fullSearchEpisodes.length <= this.state.totalEpisodeMatches) {
      this.callFullSearchEpisodes(this.props.currentFullQuery);
    }
    if (this.state.fliter === 'podcasts' && this.state.fullSearchPodcasts.length <= this.state.totalPodcastMatches) {
      this.callFullSearchPodcasts(this.props.currentFullQuery);
    }
  }

  callFullSearchEpisodes = (keywords) => {
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=${this.state.offsetEpisodes}&safe_mode=1&q=%22${keywords}%22`;
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
        if (!this.state.fullSearchEpisodes.length) {
          this.setState({
            fullSearchEpisodes: [...data.results],
            offsetEpisodes: data.next_offset,
            totalEpisodeMatches: data.total,
            calledFullSearchEpisodes: true
          });
        } else {
          this.setState({
            fullSearchEpisodes: [...this.state.fullSearchEpisodes, ...data.results],
            offsetEpisodes: data.next_offset
          });
        }
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
    if (prevProps.currentFullQuery && this.props.currentFullQuery !== prevProps.currentFullQuery) {
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

  callFullSearchPodcasts = (keywords) => {
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=podcast&offset=${this.state.offsetPodcasts}&safe_mode=1&q=%22${keywords}%22`;
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
        if (!this.state.fullSearchPodcasts.length) {
          this.setState({
            fullSearchPodcasts: [...data.results],
            offsetPodcasts: data.next_offset,
            totalPodcastMatches: data.total,
            calledFullSearchPodcasts: true
          });
        } else {
          this.setState({
            fullSearchPodcasts: [...this.state.fullSearchPodcasts, ...data.results],
            offsetPodcasts: data.next_offset
          });
        }
      })
      .catch(err => console.log(err));
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
        this.callFullSearchPodcasts(this.props.currentFullQuery);
      }
    }
  }

  render() {
    const episodesActive = this.state.fliter === 'episodes' ? 'active' : '';
    const podcastsActive = this.state.fliter === 'episodes' ? '' : 'active';
    const fullSearchEpisodes = this.state.fullSearchEpisodes;
    const fullSearchPodcasts = this.state.fullSearchPodcasts;
    let renderEpisodes;
    let renderPodcasts;
    let loadMoreBtn;

    if (fullSearchEpisodes.length && fullSearchEpisodes.length <= this.state.totalEpisodeMatches) {
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
      loadMoreBtn = (
        <button
          className="load-more"
          onClick={this.loadMoreMatches}
        >
          Load More
        </button>
      );
    } else if (this.state.calledFullSearchEpisodes) {
      renderEpisodes = (<div className="no-match-prompt">Oops... No matched results found.</div>);
    }

    if (fullSearchPodcasts.length && fullSearchPodcasts.length <= this.state.totalPodcastMatches) {
      renderPodcasts = fullSearchPodcasts.map((match) => (
        <PodcastCardStyleC
          podcast={match}
          key={match.id}
          clearInputInHeader={this.props.clearInputInHeader}
        />
      ));
      loadMoreBtn = (
        <button
          className="load-more"
          onClick={this.loadMoreMatches}
        >
          Load More
        </button>
      );
    } else if (this.state.calledFullSearchPodcasts) {
      renderPodcasts = (<div className="no-match-prompt">Oops... No matched results found.</div>);
    }

    // important to assign value to matches after computation is done.
    const matches = this.state.fliter === 'episodes' ?  renderEpisodes : renderPodcasts;

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
          <div>
            {loadMoreBtn}
          </div>
        </div>
      </div>
    )
  }
}

export default Search;
