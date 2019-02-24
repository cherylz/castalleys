import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import PodcastCardStyleB from './PodcastCardStyleB';
import { apiKey } from '../apiKey';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.delayedCallback = _.debounce(this.callAjax, 500);
  }
  state = {
    hideSearchbarResults: true,
    typeaheadPodcasts: [],
    hasMatches: true
  }
  callAjax = (keywords) => {
    if (keywords) {
      const endpoint = `https://api.listennotes.com/api/v1/typeahead?show_podcasts=1&q=%22${keywords}%22`;
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
            typeaheadPodcasts: [...data.podcasts]
          });
          if (this.state.typeaheadPodcasts.length) {
            this.setState({
              hasMatches: true
            });
          } else {
            this.setState({
              hasMatches: false
            });
          }
        })
        .catch(err => console.log(err));
    }
  }
  handleKeywordsChange = (e) => {
    console.log('firing keyword change');
    e.persist(); // is it needed here?
    const keywords = e.target.value;
    this.props.updateKeywords(keywords);
    if (keywords === '') {
      this.setState({
        hideSearchbarResults: true,
        typeaheadPodcasts: [],
        hasMatches: true
      });
    } else {
      this.setState({
        hideSearchbarResults: false,
        typeaheadPodcasts: []
        // typeaheadPodcasts: [...typeaheadPodcasts.podcasts]
      });
    }
    this.delayedCallback(keywords); // think why -> only when we move this function call outside the above conditional statement, the call with keywords being empty won't be called after user clears the input.
  }
  handleKeyUp = (e) => {
    const keywords = this.props.keywords;
    if (e.key === 'Enter' && keywords && keywords !== this.props.currentFullQuery) {
      this.setState({
        hideSearchbarResults: true,
        typeaheadPodcasts: [],
        hasMatches: true
      });
      this.props.goToOrUpdateSearchPage(keywords);
    }
  }
  resetSearchbar = () => {
    this.setState({
      hideSearchbarResults: true,
      typeaheadPodcasts: [],
      hasMatches: true
    });
    this.props.clearKeywordsAndCurrentFullQuery();
  }
  customizeColor = (e) => {
    const customColor = e.target.dataset.value;
    document.documentElement.style.setProperty('--custom-color', customColor);
    this.props.updateCustomColor(customColor);
    localStorage.setItem('customColor', customColor);
  }

  render() {
    const displayAndStyle = this.state.hideSearchbarResults ? "matched-container1 hidden" : "matched-container1";
    const renderPrompt = this.state.hasMatches ?
      (<div>Top matched podcasts for "{this.props.keywords}". Press <code>return</code> to check matched episodes and more podcasts.</div>) :
      (<div>Oops, no matched podcast found. Press <code>return</code> to check matched episodes. Good luck!</div>);
    const matchedPodcasts = this.state.typeaheadPodcasts;
    let renderMatches;
    if (matchedPodcasts && matchedPodcasts.length) {
      console.log('Header is rendering. Check if it should be handled with care.');
      renderMatches = matchedPodcasts.map((podcast) => (
        <PodcastCardStyleB
          key={podcast.id}
          podcast={podcast}
          resetSearchbar={this.resetSearchbar}
        />
      ));
    }
    return (
      <header>
        <div className="navbar">
          <div>
            <Link
              to="/"
              onClick={this.resetSearchbar}
            >
              <span className="navbar-logo navbar-logo-bg">CastAlleys</span>
              <span className="navbar-logo navbar-logo-sm">C</span>
            </Link>
          </div>
          <div className="navbar-search">
            <input
              value={this.props.keywords}
              onChange={this.handleKeywordsChange}
              onKeyUp={this.handleKeyUp}
              type="text"
              aria-label="input area for search"
              placeholder="search podcasts"
              className="navbar-search-box"
            />
            <div className={displayAndStyle}>
              {renderPrompt}
              {renderMatches}
            </div>
          </div>
          <div className="customize-color">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill={this.props.customColor}/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
            <div className="color-picker">
              <div>
                <span
                  onClick={this.customizeColor}
                  data-value="#ce0925"
                  className="dot red"
                ></span> Mars Red
              </div>
              <div>
                <span
                  onClick={this.customizeColor}
                  data-value="#dd4124"
                  className="dot orange"
                ></span> Warm Orange
              </div>
              <div>
                <span
                  onClick={this.customizeColor}
                  data-value="#009874"
                  className="dot emerald"
                ></span> Lively Emerald
              </div>
              <div>
                <span
                  onClick={this.customizeColor}
                  data-value="#ff6f61"
                  className="dot coral"
                ></span> Playful Coral
              </div>
              <div>
                <span
                  onClick={this.customizeColor}
                  data-value="#604c8d"
                  className="dot purple"
                ></span> Mystical Purple
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header;
