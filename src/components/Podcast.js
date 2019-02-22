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
    const endpoint = `https://api.listennotes.com/api/v1/podcasts/${podcastId}?sort=recent_first`;
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
        this.setState({
          podcast: rest,
          episodes: episodes,
          offsetPubDate: next_episode_pub_date
        });
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

  componentDidUpdate(prevProps) {
    //console.log(prevProps);
    //console.log(prevProps.match.params.podcastId);
    //console.log(this.props.match.params.podcastId);

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
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  callInPodcastSearch = (keywords) => {
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=${this.state.offsetMatches}&ocid=${this.state.podcast.id}&safe_mode=1&q=%22${keywords}%22`;
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
        if (!this.state.searchingInPodcast) {
          this.setState({
            query: keywords,
            offsetMatches: data.next_offset,
            totalMatches: data.total,
            matchedEpisodes: data.results,
            searchingInPodcast: true
          });
        } else {
          this.setState({
            matchedEpisodes: [...this.state.matchedEpisodes, ...data.results],
            offsetMatches: data.next_offset
          });
        }
      })
      .catch(err => console.log(err));
  }

  loadMoreMatches = () => {
    if (!this.state.searchingInPodcast) {
      const id = this.props.match.params.podcastId;
      const endpoint = `https://listennotes.p.rapidapi.com/api/v1/podcasts/${id}?next_episode_pub_date=${this.state.offsetPubDate}&sort=recent_first`;
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
          const { episodes, next_episode_pub_date } = data;
          this.setState({
            episodes: [...this.state.episodes, ...episodes],
            offsetPubDate: next_episode_pub_date
          });
        })
        .catch(err => console.log(err));
    }
    if (this.state.searchingInPodcast) {
      this.callInPodcastSearch(this.state.query);
    }
  }

  resetSearch = () => {
    this.setState({
      query: '',
      matchedEpisodes: [],
      searchingInPodcast: false
    });
  }

  render() {
    let renderPodcastInfo;
    let renderEpisodesInfo;
    let loadMoreBtn;

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
        const { title:episodeTitle, id:episodeId, description:desc, image, audio } = episode;
        const date = msToDate(episode.pub_date_ms);
        const duration = audio ? formatSeconds(episode.audio_length) : '(no audio)';
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
            updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
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
          updateEpisodeOnPlay={this.props.updateEpisodeOnPlay}
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
            <div>
              {loadMoreBtn}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Podcast;
