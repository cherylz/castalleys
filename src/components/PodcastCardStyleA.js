import React from 'react';
import { Link } from 'react-router-dom';
import { apiKey } from '../apiKey';
import { msToDate } from '../helpers';

// render user input
// press enter to search
// if there are matches, display search results with highlights
// if there is no match, display 'no match found'
// when user clears input, display the ten most recent episodes (existing data), set searchingInPodcast false, set matchedEpisodes empty.


class PodcastCardStyleA extends React.Component {
  state = {
    keywords: ''
  }

  handleKeywordsChange = (e) => {
    const keywords = e.target.value;
    this.setState({ keywords });
    if (!keywords) {
      this.props.resetSearch();
    }
    // do we need e.persist(); here?
  }

  handleSearch = (e) => {
    const keywords = this.state.keywords;
    if (e.key === 'Enter' && keywords && keywords !== this.props.query) {
      this.callInPodcastSearch(keywords);
    }
  }

  callInPodcastSearch = (keywords) => {
    const endpoint = `https://api.listennotes.com/api/v1/search?sort_by_date=0&type=episode&offset=0&ocid=${this.props.podcast.id}&safe_mode=1&q=%22${keywords}%22`;
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
        console.log(typeof(data));
        this.props.updateQueryAndMatchedResults(keywords, data.results);
      })
      .catch(err => console.log(err));
  }

  createDescMarkup = () => {
    return {__html: this.props.podcast.description};
  }

  descComponent = () => {
    return <div dangerouslySetInnerHTML={this.createDescMarkup()} className='inline' />;
  }

  render() {
    const { id, title, image:imageSrc, publisher, rss, total_episodes:totalEpisodes } = this.props.podcast;
    const website = this.props.podcast.website.replace('?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website', '');
    const itunes = `https://itunes.apple.com/podcast/id${this.props.podcast.itunes_id}`;
    const firstPublishDate = msToDate(this.props.podcast.earliest_pub_date_ms);
    const genresInString = this.props.podcast.genres.join(', ').toLowerCase() || "n/a";
    let renderTitle;
    let renderSearchBox;
    if (this.props.podcastOnWhichPage === 'podcast') {
      renderTitle = (<h1>{title}</h1>);
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

    const desc = this.descComponent();

    return (
      <div className="show">
        {renderTitle}
        <img className="artwork" src={imageSrc} alt="podcast artwork" />
        <p><em>By</em> {publisher}</p>
        {/* <button className="subscribe-btn">Subscribe</button> */}
        {renderSearchBox}
        <div>{desc}</div>
        <div className="podcast-links">
          <a href={website} target="_blank" rel='noreferrer noopener'>Website</a>
          <a href={rss} target="_blank" rel='noreferrer noopener'>RSS</a>
          <a href={itunes} target="_blank" rel='noreferrer noopener'>iTunes</a>
        </div>
        <p className="more-info">Total episodes: {totalEpisodes}</p>
        <p className="more-info">First published: {firstPublishDate}</p>
        <p className="more-info">Tags: {genresInString}</p>
      </div>
    )
  }
}

export default PodcastCardStyleA;
