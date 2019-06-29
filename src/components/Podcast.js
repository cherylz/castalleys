import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import EpisodeCardStyleC from './EpisodeCardStyleC';
import { apiKey } from '../apiKey';
import { msToDate } from '../helpers';

class Podcast extends React.Component {
  state = {
    podcast: {},
    episodes: [],
    offsetPubDate: 0,
    query: '',
    offsetMatches: 0,
    totalMatches: 0,
    matchedEpisodes: [],
    searchingInPodcast: false
  };

  componentDidMount() {
    const id = this.props.match.params.podcastId;
    if (id.length === 32) {
      this.searchPodcast(id, 'first round');
    } else {
      this.props.history.push(`/404`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // handle a marginal case: update the actual duration of an episode if that episode happens to be the one stored in local storage
    if (!prevState.episodes.length && this.props.episodeOnPlayId) {
      const ids = this.state.episodes.map(item => item.id);
      if (ids.indexOf(this.props.episodeOnPlayId) !== -1) {
        const episodesWithActualDuration = this.state.episodes.map(
          item =>
            item.id === this.props.episodeOnPlayId
              ? { ...item, duration: this.props.episodeOnPlayDuration }
              : item
        );
        this.setState({
          episodes: episodesWithActualDuration
        });
      }
    }
    if (
      this.state.searchingInPodcast &&
      !prevState.matchedEpisodes.length &&
      this.props.episodeOnPlayId
    ) {
      const ids = this.state.matchedEpisodes.map(item => item.id);
      if (ids.indexOf(this.props.episodeOnPlayId) !== -1) {
        const episodesWithActualDuration = this.state.matchedEpisodes.map(
          item =>
            item.id === this.props.episodeOnPlayId
              ? { ...item, duration: this.props.episodeOnPlayDuration }
              : item
        );
        this.setState({
          matchedEpisodes: episodesWithActualDuration
        });
      }
    }
    // handle new search with a podcast ID on Podcast page when the user presses the enter key after typing in keywords in the search bar of Header.js
    if (this.props.match.params.podcastId !== prevProps.match.params.podcastId) {
      this.setState({
        podcast: {},
        episodes: [],
        offsetPubDate: 0,
        query: '',
        offsetMatches: 0,
        totalMatches: 0,
        matchedEpisodes: [],
        searchingInPodcast: false
      });
      this.searchPodcast(this.props.match.params.podcastId, 'first round');
    }
    // handle new full search of episodes in the search bar of Header.js while the user is on Podcast page and presses the return key
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  // it's exactly the same code as in Episode.js
  markStarredOrUnstarred = podcast => {
    const starredPodcastsRef = localStorage.getItem('starredPodcasts');
    if (starredPodcastsRef && starredPodcastsRef !== '[]') {
      const starredPodcastsIds = JSON.parse(starredPodcastsRef).map(podcast => podcast.id);
      return starredPodcastsIds.indexOf(podcast.id) !== -1
        ? { ...podcast, starred: true }
        : { ...podcast, starred: false };
    }
    return { ...podcast, starred: false };
  };

  // it's exactly the same code as in Episode.js
  starPodcast = () => {
    // update the starred status in this.state.podcast
    const starredPodcast = { ...this.state.podcast, starred: true };
    this.setState({ podcast: starredPodcast });

    // add the newly starred podcast to localStorage
    const { image, title, description: desc, publisher, id } = starredPodcast;
    const processedPodcast = { image, title, desc, publisher, id };
    const starredPodcastsRef = localStorage.getItem('starredPodcasts');
    if (starredPodcastsRef && starredPodcastsRef !== '[]') {
      const updated = JSON.parse(starredPodcastsRef);
      updated.push(processedPodcast);
      localStorage.setItem('starredPodcasts', JSON.stringify(updated));
    } else {
      localStorage.setItem('starredPodcasts', JSON.stringify(Array.of(processedPodcast)));
    }
  };

  // it's exactly the same code as in Episode.js
  unstarPodcast = () => {
    // update the unstarred status in this.state.podcast
    const unstarredPodcast = { ...this.state.podcast, starred: false };
    this.setState({ podcast: unstarredPodcast });

    // remove the unstarred podcast from localStorage
    const lastStored = JSON.parse(localStorage.getItem('starredPodcasts'));
    const updated = lastStored.filter(item => item.id !== unstarredPodcast.id);
    localStorage.setItem('starredPodcasts', JSON.stringify(updated));
  };

  searchPodcast = (podcastId, status) => {
    const endpoint =
      status === 'first round'
        ? `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}?sort=recent_first`
        : `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}?next_episode_pub_date=${
            this.state.offsetPubDate
          }&sort=recent_first`;
    const request = {
      method: 'GET',
      headers: {
        'X-ListenAPI-Key': apiKey,
        Accept: 'application/json'
      }
    };
    fetch(endpoint, request)
      .then(res => res.json())
      .then(data => {
        const { episodes, next_episode_pub_date, ...rest } = data;
        const processedEpisodes = episodes.map(episode => {
          const { audio_length_sec, pub_date_ms, ...episodeParts } = episode;
          return {
            ...episodeParts,
            duration: episode.audio ? audio_length_sec : '(no audio)',
            date: msToDate(pub_date_ms)
          };
        });
        if (this.state.episodes.length === 0) {
          this.setState({
            podcast: this.markStarredOrUnstarred(rest),
            episodes: processedEpisodes,
            offsetPubDate: next_episode_pub_date
          });
        } else {
          this.setState({
            episodes: [...this.state.episodes, ...processedEpisodes],
            offsetPubDate: next_episode_pub_date
          });
        }
        this.setState({ searchingForMore: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ searchingForMore: false });
      });
  };

  callInPodcastSearch = (keywords, status) => {
    const offset = status === 'first round' ? 0 : this.state.offsetMatches;
    const endpoint = `https://listen-api.listennotes.com/api/v2/search?sort_by_date=0&type=episode&offset=${offset}&ocid=${
      this.state.podcast.id
    }&safe_mode=1&q=%22${keywords}%22`;
    const request = {
      method: 'GET',
      headers: {
        'X-ListenAPI-Key': apiKey,
        Accept: 'application/json'
      }
    };
    fetch(endpoint, request)
      .then(res => res.json())
      .then(data => {
        const processedEpisodes = data.results.map(episode => {
          const { audio_length_sec, pub_date_ms, ...episodeParts } = episode;
          return {
            ...episodeParts,
            duration: episode.audio ? audio_length_sec : '(no audio)',
            date: msToDate(pub_date_ms)
          };
        });
        if (!this.state.searchingInPodcast) {
          this.setState({
            query: keywords,
            offsetMatches: data.next_offset,
            totalMatches: data.total,
            matchedEpisodes: processedEpisodes,
            searchingInPodcast: true
          });
        } else if (this.state.query === keywords) {
          this.setState({
            matchedEpisodes: [...this.state.matchedEpisodes, ...processedEpisodes],
            offsetMatches: data.next_offset
          });
        } else if (this.state.query !== keywords) {
          this.setState({
            query: keywords,
            offsetMatches: data.next_offset,
            totalMatches: data.total,
            matchedEpisodes: processedEpisodes
          });
        }
        this.setState({ searchingForMore: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ searchingForMore: false });
      });
  };

  updateEpisodeOnPlayAndMaybeActualDuration = episode => {
    // Step 1: update the actual duration of the episode on play in this.state.episodes or this.state.matchedEpisodes
    const episodesToMap = this.state.searchingInPodcast
      ? this.state.matchedEpisodes
      : this.state.episodes;
    const episodesWithActualDuration = episodesToMap.map(
      item => (item.id === episode.episodeId ? { ...item, duration: episode.duration } : item)
    );
    if (!this.state.searchingInPodcast) {
      this.setState({
        episodes: episodesWithActualDuration
      });
    } else {
      this.setState({
        matchedEpisodes: episodesWithActualDuration
      });
    }
    // Step 2: update the episode on play with actual duration in this.state.epsidoeOnDisplay of App.js
    this.props.updateEpisodeOnPlay(episode);
  };

  updateActualDuration = duration => {
    // the duration passed in is in HH:MM:SS format
    // update the actual duration in this.state.episodes and this.state.matchedEpisodes if applicable
    const episodeOnPlayId = this.props.episodeOnPlayId;
    if (this.state.searchingInPodcast) {
      const updated = this.state.matchedEpisodes.map(
        item => (item.id === episodeOnPlayId ? { ...item, duration } : item)
      );
      this.setState({ matchedEpisodes: updated });
    }
    const updated = this.state.episodes.map(
      item => (item.id === episodeOnPlayId ? { ...item, duration } : item)
    );
    this.setState({ episodes: updated });
    // also update the actual duration in this.state.episodeOnPlay of App.js
    this.props.updateActualDurationOfEpisodeOnPlay(duration);
  };

  loadMoreMatches = () => {
    this.setState({ searchingForMore: true });
    if (!this.state.searchingInPodcast) {
      const podcastId = this.props.match.params.podcastId;
      this.searchPodcast(podcastId, '');
    } else {
      this.callInPodcastSearch(this.state.query, '');
    }
  };

  resetSearch = () => {
    this.setState({
      query: '',
      offsetMatches: 0,
      totalMatches: 0,
      matchedEpisodes: [],
      searchingInPodcast: false
    });
  };

  render() {
    let renderPodcastAndEpisodes;
    let renderPodcastInfo;
    let renderEpisodesInfo;
    let loadMoreBtn;
    let loadingPromptWhenNeeded = (
      <div className="loading-prompt">Loading... Good things are worth waiting for :)</div>
    );

    if (
      !this.state.searchingInPodcast &&
      this.state.episodes.length < this.state.podcast.total_episodes
    ) {
      loadMoreBtn = this.state.searchingForMore ? (
        <button className="load-more-btn disable-load">Loading</button>
      ) : (
        <button className="load-more-btn" onClick={this.loadMoreMatches}>
          Load More
        </button>
      );
    } else if (
      this.state.searchingInPodcast &&
      this.state.matchedEpisodes.length < this.state.totalMatches
    ) {
      loadMoreBtn = this.state.searchingForMore ? (
        <button className="load-more-btn disable-load">Loading</button>
      ) : (
        <button className="load-more-btn" onClick={this.loadMoreMatches}>
          Load More
        </button>
      );
    }

    if (Object.keys(this.state.podcast).length) {
      loadingPromptWhenNeeded = null;
      renderPodcastInfo = (
        <PodcastCardStyleA
          podcastOnWhichPage="podcast"
          podcast={this.state.podcast}
          query={this.state.query}
          customColor={this.props.customColor}
          callInPodcastSearch={this.callInPodcastSearch}
          updateQueryAndMatchedResults={this.updateQueryAndMatchedResults}
          resetSearch={this.resetSearch}
          starPodcast={this.starPodcast}
          unstarPodcast={this.unstarPodcast}
        />
      );
    }

    if (!this.state.searchingInPodcast && this.state.episodes.length) {
      renderEpisodesInfo = this.state.episodes.map(episode => {
        const {
          title: episodeTitle,
          id: episodeId,
          description: desc,
          image,
          audio,
          date,
          duration
        } = episode;
        const processedEpisode = {
          episodeTitle,
          episodeId,
          desc,
          image,
          audio,
          date,
          duration
        };
        const faved = this.props.favedEpisodesIds.indexOf(episode.id) !== -1;
        return (
          <EpisodeCardStyleA
            key={episode.id}
            episodeOnWhichPage="podcast"
            podcastId={this.state.podcast.id}
            podcastTitle={this.state.podcast.title}
            episode={processedEpisode}
            episodeOnPlayId={this.props.episodeOnPlayId}
            playing={this.props.playing}
            updateEpisodeOnPlayAndMaybeActualDuration={
              this.updateEpisodeOnPlayAndMaybeActualDuration
            }
            updateActualDuration={this.updateActualDuration}
            updatePlaying={this.props.updatePlaying}
            customColor={this.props.customColor}
            faved={faved}
            favEpisode={this.props.addFavedEpisode}
            unFavEpisode={this.props.removeFavedEpisode}
          />
        );
      });
    } else if (this.state.searchingInPodcast && this.state.matchedEpisodes.length) {
      renderEpisodesInfo = this.state.matchedEpisodes.map(episode => {
        const faved = this.props.favedEpisodesIds.indexOf(episode.id) !== -1;
        return (
          <EpisodeCardStyleC
            key={episode.id}
            episode={episode}
            episodeOnPlayId={this.props.episodeOnPlayId}
            playing={this.props.playing}
            updateEpisodeOnPlayAndMaybeActualDuration={
              this.updateEpisodeOnPlayAndMaybeActualDuration
            }
            updateActualDuration={this.updateActualDuration}
            updatePlaying={this.props.updatePlaying}
            customColor={this.props.customColor}
            faved={faved}
            favEpisode={this.props.addFavedEpisode}
            unFavEpisode={this.props.removeFavedEpisode}
          />
        );
      });
    } else if (this.state.searchingInPodcast && !this.state.matchedEpisodes.length) {
      renderEpisodesInfo = <div className="no-match-prompt">Oops... No matched results found.</div>;
    }

    if (Object.keys(this.state.podcast).length) {
      renderPodcastAndEpisodes = (
        <div className="podcast-episode-container">
          {renderPodcastInfo}
          <div className="episodes">
            {renderEpisodesInfo}
            {loadMoreBtn}
          </div>
        </div>
      );
    }

    return (
      <div className="page-container">
        {loadingPromptWhenNeeded}
        {renderPodcastAndEpisodes}
      </div>
    );
  }
}

export default Podcast;
