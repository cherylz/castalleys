import React from 'react';
import PodcastCardStyleC from './PodcastCardStyleC';
import EpisodeCardStyleB from './EpisodeCardStyleB';
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
    calledFullSearchPodcasts: false,
    searchingForMore: false
  };

  componentDidMount() {
    const keywords = this.props.match.params.keywords;
    this.callFullSearchEpisodes(keywords, 'first round');
    this.props.goToOrUpdateSearchPage(keywords);
  }

  componentDidUpdate(prevProps, prevState) {
    // handle a marginal case: update the actual duration of an episode if that episode happens to be the one stored in local storage
    if (!prevState.fullSearchEpisodes.length && this.props.episodeOnPlayId) {
      const ids = this.state.fullSearchEpisodes.map(item => item.id);
      if (ids.indexOf(this.props.episodeOnPlayId) !== -1) {
        const fullSearchEpisodesWithActualDuration = this.state.fullSearchEpisodes.map(
          item =>
            item.id === this.props.episodeOnPlayId
              ? { ...item, audio_length: this.props.episodeOnPlayDuration }
              : item
        );
        this.setState({
          fullSearchEpisodes: fullSearchEpisodesWithActualDuration
        });
      }
    }
    // handle new search of episodes in the same Search.js component, i.e. user presses the return key with new keywords in the search bar of Header.js while on the search page
    if (
      prevProps.currentFullQuery &&
      this.props.currentFullQuery !== prevProps.currentFullQuery
    ) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
      this.setState({
        fullSearchPodcasts: [],
        fullSearchEpisodes: [],
        offsetEpisodes: 0,
        totalEpisodeMatches: 0,
        offsetPodcasts: 0,
        totalPodcastMatches: 0,
        fliter: 'episodes',
        calledFullSearchEpisodes: false,
        calledFullSearchPodcasts: false
      });
      this.callFullSearchEpisodes(this.props.currentFullQuery, 'first round');
    }
  }

  callFullSearchEpisodes = (keywords, status) => {
    const endpoint =
      status === 'first round'
        ? `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=0&safe_mode=1&q=%22${keywords}%22`
        : `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=${
            this.state.offsetEpisodes
          }&safe_mode=1&q=%22${keywords}%22`;
    const request = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        Accept: 'application/json'
      }
    };
    fetch(endpoint, request)
      .then(res => res.json())
      .then(data => {
        if (!this.state.fullSearchEpisodes.length) {
          this.setState({
            fullSearchEpisodes: data.results,
            offsetEpisodes: data.next_offset,
            totalEpisodeMatches: data.total,
            calledFullSearchEpisodes: true
          });
        } else {
          this.setState({
            fullSearchEpisodes: [
              ...this.state.fullSearchEpisodes,
              ...data.results
            ],
            offsetEpisodes: data.next_offset
          });
        }
        this.setState({ searchingForMore: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ searchingForMore: false });
      });
  };

  starPodcast = starredPodcast => {
    // update the starred status in this.state.fullSearchPodcasts
    const processedPodcasts = this.state.fullSearchPodcasts.map(
      item => (item.id === starredPodcast.id ? starredPodcast : item)
    );
    this.setState({ fullSearchPodcasts: processedPodcasts });

    // add the newly starred podcast to localStorage
    const {
      image,
      title_original: title,
      description_original: desc,
      publisher_original: publisher,
      id
    } = starredPodcast;
    const processedPodcast = { image, title, desc, publisher, id };
    const starredPodcastsRef = localStorage.getItem('starredPodcasts');
    if (starredPodcastsRef && starredPodcastsRef !== '[]') {
      const updated = JSON.parse(starredPodcastsRef);
      updated.push(processedPodcast);
      localStorage.setItem('starredPodcasts', JSON.stringify(updated));
    } else {
      localStorage.setItem(
        'starredPodcasts',
        JSON.stringify(Array.of(processedPodcast))
      );
    }
  };

  unstarPodcast = unstarredPodcast => {
    // update the unstarred status in this.state.fullSearchPodcasts
    const processedPodcasts = this.state.fullSearchPodcasts.map(
      item => (item.id === unstarredPodcast.id ? unstarredPodcast : item)
    );
    this.setState({ fullSearchPodcasts: processedPodcasts });

    // remove the unstarred podcast from localStorage
    const lastStored = JSON.parse(localStorage.getItem('starredPodcasts'));
    const updated = lastStored.filter(item => item.id !== unstarredPodcast.id);
    localStorage.setItem('starredPodcasts', JSON.stringify(updated));
  };

  markStarredOrUnstarred = podcasts => {
    const starredPodcastsRef = localStorage.getItem('starredPodcasts');
    if (starredPodcastsRef && starredPodcastsRef !== '[]') {
      const starredPodcastsIds = JSON.parse(starredPodcastsRef).map(
        podcast => podcast.id
      );
      return podcasts.map(
        podcast =>
          starredPodcastsIds.indexOf(podcast.id) !== -1
            ? { ...podcast, starred: true }
            : { ...podcast, starred: false }
      );
    } else {
      return podcasts.map(podcast => {
        return { ...podcast, starred: false };
      });
    }
  };

  callFullSearchPodcasts = keywords => {
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=podcast&offset=${
      this.state.offsetPodcasts
    }&safe_mode=1&q=%22${keywords}%22`;
    const request = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        Accept: 'application/json'
      }
    };
    fetch(endpoint, request)
      .then(res => res.json())
      .then(data => {
        if (!this.state.fullSearchPodcasts.length) {
          this.setState({
            fullSearchPodcasts: this.markStarredOrUnstarred(data.results),
            offsetPodcasts: data.next_offset,
            totalPodcastMatches: data.total,
            calledFullSearchPodcasts: true
          });
        } else {
          this.setState({
            fullSearchPodcasts: [
              ...this.state.fullSearchPodcasts,
              ...this.markStarredOrUnstarred(data.results)
            ],
            offsetPodcasts: data.next_offset
          });
        }
        this.setState({ searchingForMore: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ searchingForMore: false });
      });
  };

  handleFilterChange = e => {
    if (e.target.id === 'episodes') {
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
  };

  updateEpisodeOnPlayAndMaybeActualDuration = episode => {
    // Step 1: update the actual duration of the episode on play in this.state.fullSearchEpisodes
    const fullSearchEpisodesWithActualDuration = this.state.fullSearchEpisodes.map(
      item =>
        item.id === episode.episodeId
          ? { ...item, audio_length: episode.duration }
          : item
    );
    this.setState({
      fullSearchEpisodes: fullSearchEpisodesWithActualDuration
    });
    // Step 2: update the episode on play with actual duration in this.state.epsidoeOnDisplay of App.js
    this.props.updateEpisodeOnPlay(episode);
  };

  updateActualDuration = (duration, episodeId) => {
    // the duration passed in is in HH:MM:SS format
    const fullSearchEpisodesWithActualDuration = this.state.fullSearchEpisodes.map(
      item =>
        item.id === episodeId ? { ...item, audio_length: duration } : item
    );
    this.setState({
      fullSearchEpisodes: fullSearchEpisodesWithActualDuration
    });
    this.props.updateActualDurationOfEpisodeOnPlay(duration);
  };

  loadMoreMatches = () => {
    this.setState({ searchingForMore: true });
    if (this.state.fliter === 'episodes') {
      this.callFullSearchEpisodes(this.props.currentFullQuery, '');
    }
    if (this.state.fliter === 'podcasts') {
      this.callFullSearchPodcasts(this.props.currentFullQuery);
    }
  };

  render() {
    const episodesActive = this.state.fliter === 'episodes' ? 'active' : '';
    const podcastsActive = this.state.fliter === 'episodes' ? '' : 'active';
    const fullSearchEpisodes = this.state.fullSearchEpisodes;
    const fullSearchPodcasts = this.state.fullSearchPodcasts;
    let renderEpisodes = <div className="no-match-prompt">Searching :)</div>;
    let renderPodcasts = <div className="no-match-prompt">Searching :)</div>;
    let loadMoreBtn;

    if (
      this.state.fliter === 'episodes' &&
      fullSearchEpisodes.length < this.state.totalEpisodeMatches
    ) {
      loadMoreBtn = this.state.searchingForMore ? (
        <button className="load-more disable-load">Loading</button>
      ) : (
        <button className="load-more" onClick={this.loadMoreMatches}>
          Load More
        </button>
      );
    } else if (
      this.state.fliter === 'podcasts' &&
      fullSearchPodcasts.length < this.state.totalPodcastMatches
    ) {
      loadMoreBtn = this.state.searchingForMore ? (
        <button className="load-more disable-load">Loading</button>
      ) : (
        <button className="load-more" onClick={this.loadMoreMatches}>
          Load More
        </button>
      );
    }

    if (fullSearchEpisodes.length) {
      renderEpisodes = fullSearchEpisodes.map(episode => {
        const faved = this.props.favedEpisodesIds.indexOf(episode.id) !== -1;
        return (
          <EpisodeCardStyleB
            key={episode.id}
            episode={episode}
            updateEpisodeOnPlayAndMaybeActualDuration={
              this.updateEpisodeOnPlayAndMaybeActualDuration
            }
            updateActualDuration={this.updateActualDuration}
            episodeOnPlayId={this.props.episodeOnPlayId}
            playing={this.props.playing}
            updatePlaying={this.props.updatePlaying}
            resetSearchbar={this.props.resetSearchbar}
            customColor={this.props.customColor}
            faved={faved}
            favEpisode={this.props.addFavedEpisode}
            unFavEpisode={this.props.removeFavedEpisode}
          />
        );
      });
    } else if (this.state.calledFullSearchEpisodes) {
      renderEpisodes = (
        <div className="no-match-prompt">Oops... No matched result found.</div>
      );
    }

    if (fullSearchPodcasts.length) {
      renderPodcasts = fullSearchPodcasts.map(match => (
        <PodcastCardStyleC
          podcast={match}
          key={match.id}
          resetSearchbar={this.props.resetSearchbar}
          customColor={this.props.customColor}
          starPodcast={this.starPodcast}
          unstarPodcast={this.unstarPodcast}
        />
      ));
    } else if (this.state.calledFullSearchPodcasts) {
      renderPodcasts = (
        <div className="no-match-prompt">Oops... No matched result found.</div>
      );
    }

    // important to assign value to `matches` after the computation of renderEpisodes and renderPodcasts is done.
    const matches =
      this.state.fliter === 'episodes' ? renderEpisodes : renderPodcasts;

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
          <div className="matched-results">{matches}</div>
          <div>{loadMoreBtn}</div>
        </div>
      </div>
    );
  }
}

export default Search;
