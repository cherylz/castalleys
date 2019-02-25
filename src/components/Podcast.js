import React from 'react';
import PodcastCardStyleA from './PodcastCardStyleA';
import EpisodeCardStyleA from './EpisodeCardStyleA';
import EpisodeCardStyleC from './EpisodeCardStyleC';
import { apiKey } from '../apiKey';
import { formatSeconds, msToDate } from '../helpers';

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
  }

  searchPodcast = (podcastId) => {
    const endpoint = this.state.episodes.length === 0 ?
      `https://api.listennotes.com/api/v1/podcasts/${podcastId}?sort=recent_first` :
      `https://api.listennotes.com/api/v1/podcasts/${podcastId}?next_episode_pub_date=${this.state.offsetPubDate}&sort=recent_first`;
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
        const {episodes, next_episode_pub_date, ...rest} = data;
        const processedEpisodes = episodes.map(episode => {
          const processedEpisode = {...episode};
          delete processedEpisode.audio_length;
          delete processedEpisode.pub_date_ms;
          processedEpisode.duration = episode.audio ? formatSeconds(episode.audio_length) : '(no audio)';
          processedEpisode.date = msToDate(episode.pub_date_ms);
          return processedEpisode;
        });
        if (this.state.episodes.length === 0) {
          this.setState({
            podcast: rest,
            episodes: processedEpisodes,
            offsetPubDate: next_episode_pub_date
          });
        } else {
          this.setState({
            episodes: [...this.state.episodes, ...processedEpisodes],
            offsetPubDate: next_episode_pub_date
          });
        }
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    const id = this.props.match.params.podcastId;
    if (id.length === 32) {
      this.searchPodcast(id);
    } else {
      this.props.history.push(`/404`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // handle a marginal case: update the actual duration of an episode if that episode happens to be the one stored in local storage
    if (!prevState.episodes.length && this.props.episodeOnPlayId) {
      const ids = this.state.episodes.map(item => item.id);
      if (ids.indexOf(this.props.episodeOnPlayId) !== -1) {
        const episodesWithActualDuration = this.state.episodes.map(item => {
          if (item.id === this.props.episodeOnPlayId) {
            item.duration = this.props.episodeOnPlayDuration;
          }
          return item;
        });
        this.setState({
          episodes: episodesWithActualDuration
        });
      }
    }
    if (this.state.searchingInPodcast && !prevState.matchedEpisodes.length && this.props.episodeOnPlayId) {
      const ids = this.state.matchedEpisodes.map(item => item.id);
      if (ids.indexOf(this.props.episodeOnPlayId) !== -1) {
        const episodesWithActualDuration = this.state.matchedEpisodes.map(item => {
          if (item.id === this.props.episodeOnPlayId) {
            item.duration = this.props.episodeOnPlayDuration;
          }
          return item;
        });
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
      this.searchPodcast(this.props.match.params.podcastId);
      console.log('calling api~~~');
    }
    // handle new full search of episodes in the search bar of Header.js while the user is on Podcast page and presses the return key
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  callInPodcastSearch = (keywords) => {
    const offset = this.state.query === keywords ? this.state.offsetMatches : 0;
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=${offset}&ocid=${this.state.podcast.id}&safe_mode=1&q=%22${keywords}%22`;
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
        const processedEpisodes = data.results.map(episode => {
          const processedEpisode = {...episode};
          delete processedEpisode.audio_length;
          delete processedEpisode.pub_date_ms;
          processedEpisode.duration = episode.audio ? episode.audio_length : '(no audio)';
          processedEpisode.date = msToDate(episode.pub_date_ms);
          return processedEpisode;
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
      })
      .catch(err => console.log(err));
  }
  //TBCCCC: in the same search in podcast, user has a second round of search. the current solution may have a loophole to append new search after old search results.

  updateEpisodeOnPlayAndMaybeActualDuration = (episode) => {
    // Step 1: update the actual duration of the episode on play in this.state.episodes or this.state.matchedEpisodes
    const episodesToMap = this.state.searchingInPodcast ? this.state.matchedEpisodes : this.state.episodes;
    const episodesWithActualDuration = episodesToMap.map(item => {
      if (item.id === episode.episodeId) {
        item.duration = episode.duration;
      }
      return item;
    });
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
  }

  updateActualDuration = (duration, episodeId) => {
    // the duration passed in is in HH:MM:SS format
    const episodesToMap = this.state.searchingInPodcast ? this.state.matchedEpisodes : this.state.episodes;
    const episodesWithActualDuration = episodesToMap.map(item => {
      if (item.id === episodeId) {
        item.duration = duration;
      }
      return item;
    });
    if (!this.state.searchingInPodcast) {
      this.setState({
        episodes: episodesWithActualDuration
      });
    } else {
      this.setState({
        matchedEpisodes: episodesWithActualDuration
      });
    }
    this.props.updateActualDurationOfEpisodeOnPlay(duration);
  }

  loadMoreMatches = () => {
    if (!this.state.searchingInPodcast) {
      const podcastId = this.props.match.params.podcastId;
      this.searchPodcast(podcastId);
    } else {
      this.callInPodcastSearch(this.state.query);
    }
  }

  resetSearch = () => {
    this.setState({
      query: '',
      offsetMatches: 0,
      totalMatches: 0,
      matchedEpisodes: [],
      searchingInPodcast: false
    });
  }

  render() {
    let renderPodcastInfo;
    let renderEpisodesInfo;
    let loadMoreBtn;
    let loadingPromptWhenNeeded = (<div className="loading-prompt">Loading... Good things worth waiting :)</div>);

    if (!this.state.searchingInPodcast && this.state.episodes.length < this.state.podcast.total_episodes) {
      loadMoreBtn = (
        <button
          className="load-more-btn"
          onClick={this.loadMoreMatches}
        >
          Load More
        </button>
      );
    } else if (this.state.searchingInPodcast && this.state.matchedEpisodes.length < this.state.totalMatches) {
      loadMoreBtn = (
        <button
          className="load-more-btn"
          onClick={this.loadMoreMatches}
        >
          Load More
        </button>
      );
    }

    if (Object.keys(this.state.podcast).length) {
      loadingPromptWhenNeeded = '';
      renderPodcastInfo = (
        <PodcastCardStyleA
          podcastOnWhichPage='podcast'
          podcast={this.state.podcast}
          query={this.state.query}
          callInPodcastSearch={this.callInPodcastSearch}
          updateQueryAndMatchedResults={this.updateQueryAndMatchedResults}
          resetSearch={this.resetSearch}
        />
      );
    }

    if (!this.state.searchingInPodcast && this.state.episodes.length) {
      renderEpisodesInfo = this.state.episodes.map((episode) => {
        const { title:episodeTitle, id:episodeId, description:desc, image, audio, date, duration } = episode;
        const processedEpisode = { episodeTitle, episodeId, desc, image, audio, date, duration };
        return (
          <EpisodeCardStyleA
            key={episode.id}
            episodeOnWhichPage='podcast'
            podcastId={this.state.podcast.id}
            podcastTitle={this.state.podcast.title}
            episode={processedEpisode}
            episodeOnPlayId={this.props.episodeOnPlayId}
            playing={this.props.playing}
            updateEpisodeOnPlayAndMaybeActualDuration={this.updateEpisodeOnPlayAndMaybeActualDuration}
            updateActualDuration={this.updateActualDuration}
            updatePlaying={this.props.updatePlaying}
          />
        );
      });
    } else if (this.state.searchingInPodcast && this.state.matchedEpisodes.length) {
      renderEpisodesInfo = this.state.matchedEpisodes.map((episode) => (
        <EpisodeCardStyleC
          key={episode.id}
          episode={episode}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlayAndMaybeActualDuration={this.updateEpisodeOnPlayAndMaybeActualDuration}
          updateActualDuration={this.updateActualDuration}
          updatePlaying={this.props.updatePlaying}
        />
      ));
    } else if (this.state.searchingInPodcast && !this.state.matchedEpisodes.length) {
      renderEpisodesInfo = (<div className="no-match-prompt">Oops... No matched results found.</div>);
    }
    return (
      <div className="page-container">
        <div className="podcast-episode-container">
          {renderPodcastInfo}
          <div className="episodes">
            {renderEpisodesInfo}
            {loadMoreBtn}
          </div>
        </div>
        {loadingPromptWhenNeeded}
      </div>
    )
  }
}

export default Podcast;
