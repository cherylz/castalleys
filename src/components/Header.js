import React from 'react';
import _ from 'lodash';
import PodcastCardStyleB from './PodcastCardStyleB';
import { apiKey } from '../apiKey';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.delayedCallback = _.debounce(this.callAjax, 1000);
  }
  callAjax = (keywords) => {
    console.log(keywords);
    const endpoint = `https://listennotes.p.mashape.com/api/v1/typeahead?q=%22${keywords}%22&show_podcasts=1&show_genres`;
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
        this.props.updateSearchbarResults(data);
      })
      .catch(err => console.log(err));
  }
  handleChange = (e) => {
    e.persist();
    this.props.onKeywordsChange(e.target.value);
    this.delayedCallback(e.target.value);
  }
  handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      this.props.onKeyUp(e.target.value);
    }
  }
  render() {
    const displayAndStyle = this.props.hideSearchbarResults ? "matched-container1 hidden" : "matched-container1";
    console.log(displayAndStyle); // To tackle: rendered twice...
    const matchedPodcasts = this.props.matchedPodcasts;
    let renderMatches;
    if (matchedPodcasts) {
      renderMatches = matchedPodcasts.map((podcast) => (
        <PodcastCardStyleB
          key={podcast.id}
          podcast={podcast}
        />
      ));
    }
    return (
      <header>
        <div className="navbar-bg">
          <div>
            <a href="/"><span className="navbar-logo">CastAlleys</span></a>
          </div>
          <div className="navbar-search">
            <input
              value={this.props.keywords}
              onChange={this.handleChange}
              onKeyUp={this.handleKeyUp}
              type="text"
              placeholder="search podcasts"
              className="navbar-search-box"
            />
            <div className={displayAndStyle}>
              <div>
                Search for "{this.props.keywords}". Press <code>Enter</code> for more.
              </div>
              {renderMatches}
            </div>
          </div>
          <div className="customize-color">
            <i className="material-icons custom-color">
              color_lens
            </i>
          </div>
        </div>
      </header>
    )
  }
}

export default Header;
