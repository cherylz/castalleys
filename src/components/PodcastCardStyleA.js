import React from 'react';
import { Link } from 'react-router-dom';
import { msToDate } from '../helpers';

class PodcastCardStyleA extends React.Component {
  state = {
    keywords: ''
  };

  handleKeywordsChange = e => {
    const keywords = e.target.value;
    this.setState({ keywords });
    if (!keywords) {
      this.props.resetSearch();
    }
  };

  handleSearch = e => {
    const keywords = this.state.keywords;
    if (e.key === 'Enter' && keywords && keywords !== this.props.query) {
      this.props.callInPodcastSearch(keywords, 'first round');
    }
  };

  createDescMarkup = () => {
    return { __html: this.props.podcast.description };
  };
  descComponent = () => {
    return <div dangerouslySetInnerHTML={this.createDescMarkup()} className="inline" />;
  };

  render() {
    const {
      id,
      title,
      image: imageSrc,
      publisher,
      rss,
      total_episodes: totalEpisodes
    } = this.props.podcast;
    const desc = this.descComponent();
    const website = this.props.podcast.website.replace(
      '?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website',
      ''
    );
    const itunes = `https://itunes.apple.com/podcast/id${this.props.podcast.itunes_id}`;
    const firstPublishDate = msToDate(this.props.podcast.earliest_pub_date_ms);
    // const genresInString = this.props.podcast.genres.join(', ').toLowerCase() || 'n/a';
    let renderTitle;
    let renderSearchBox;
    if (this.props.podcastOnWhichPage === 'podcast') {
      renderTitle = <h1>{title}</h1>;
      renderSearchBox = (
        <input
          value={this.state.keywords}
          onChange={this.handleKeywordsChange}
          onKeyUp={this.handleSearch}
          className="search-in-podcast"
          type="text"
          placeholder="search in podcast"
        />
      );
    } else if (this.props.podcastOnWhichPage === 'episode') {
      renderTitle = (
        <Link to={`/podcast/${id}`}>
          <h1>{title}</h1>
        </Link>
      );
    }
    const toggleStarIcon = this.props.podcast.starred ? (
      <svg
        onClick={this.props.unstarPodcast}
        className="star"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          fill={this.props.customColor}
        />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    ) : (
      <svg
        onClick={this.props.starPodcast}
        className="unstar"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
          fill={this.props.customColor}
        />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
    return (
      <div className="show">
        {renderTitle}
        <div>{toggleStarIcon}</div>
        <img className="artwork" src={imageSrc} alt="podcast artwork" />
        <p>
          <em>From</em> {publisher}
        </p>

        {renderSearchBox}
        <div>{desc}</div>
        <div className="podcast-links">
          <a href={website} target="_blank" rel="noreferrer noopener">
            Website
          </a>
          <a href={rss} target="_blank" rel="noreferrer noopener">
            RSS
          </a>
          <a href={itunes} target="_blank" rel="noreferrer noopener">
            iTunes
          </a>
        </div>
        <p className="more-info">Total episodes: {totalEpisodes}</p>
        <p className="more-info">First published: {firstPublishDate}</p>
        {/* <p className="more-info">Tags: {genresInString}</p> */}
      </div>
    );
  }
}

export default PodcastCardStyleA;
