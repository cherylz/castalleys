import React from 'react';
import { Link } from 'react-router-dom';
import PodcastCardStyleB from './PodcastCardStyleB';
import { apiKey } from '../apiKey';

class Header extends React.Component {
  state = {
    hideColorPicker: true,
    hideMenu: true
  };

  customizeColor = e => {
    const customColor = e.target.dataset.value;
    document.documentElement.style.setProperty('--custom-color', customColor);
    this.props.updateCustomColor(customColor);
    localStorage.setItem('customColor', customColor);
  };

  debouncedTypeaheadSearch = keywords => {
    if (keywords) {
      clearTimeout(this.lastCallTimer);
      this.lastCallTimer = setTimeout(() => {
        const endpoint = `https://listen-api.listennotes.com/api/v2/typeahead?show_podcasts=1&q=%22${keywords}%22`;
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
            const hasMatches = data.podcasts.length ? true : false;
            this.props.updateTypeaheadSearch(data.podcasts, hasMatches);
          })
          .catch(err => console.log(err));
      }, 500);
    }
  };

  handleKeywordsChange = e => {
    const keywords = e.target.value;
    this.props.updateKeywords(keywords);
    if (keywords === '') {
      this.props.cleanTypeaheadSearch();
    } else {
      this.props.activateSearchbar();
    }
    this.debouncedTypeaheadSearch(keywords); // only when we keep this function call outside the above conditional statement, the call with keywords being empty won't be called after user clears the input.
  };

  handleKeyUp = e => {
    const keywords = this.props.keywords;
    if (e.key === 'Enter' && keywords && keywords !== this.props.currentFullQuery) {
      this.props.cleanTypeaheadSearch();
      this.props.goToOrUpdateSearchPage(keywords);
    }
  };

  toggleColorPicker = () => {
    this.setState({ hideColorPicker: !this.state.hideColorPicker });
  };

  toggleMenu = () => {
    this.setState({ hideMenu: !this.state.hideMenu });
  };

  handleClickInMenu = () => {
    this.setState({ hideMenu: !this.state.hideMenu });
    this.props.resetSearchbar();
  };

  render() {
    const styleOnTouchScreenOnly = this.state.hideColorPicker
      ? 'color-picker'
      : 'color-picker visible';
    const displayMenuItems = this.state.hideMenu ? 'menu-items' : 'menu-items display';
    const displayAndStyle = this.props.hideSearchbarResults
      ? 'matched-container1 hidden'
      : 'matched-container1';
    const menuIcon = (
      <svg
        onClick={this.toggleMenu}
        className="prevent-tap-hl"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill={this.props.customColor} />
      </svg>
    );
    const closeIcon = (
      <svg
        onClick={this.toggleMenu}
        className="prevent-tap-hl"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          fill="#808080"
        />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
    const toggleMenuIcon = this.state.hideMenu ? menuIcon : closeIcon;
    const matchedPodcasts = this.props.typeaheadPodcasts;
    const keywords = this.props.keywords;
    const currentFullQuery = this.props.currentFullQuery;

    let renderPrompt;
    if (keywords) {
      if (this.props.hasMatches) {
        if (matchedPodcasts.length) {
          if (keywords === currentFullQuery) {
            renderPrompt = (
              <div>
                Top matched podcasts for "{this.props.keywords}". Check on the page below to see
                matched episodes and more matched podcasts.
              </div>
            );
          } else {
            renderPrompt = (
              <div>
                Top matched podcasts for "{this.props.keywords}". Press <code>return</code> to check
                matched episodes and more podcasts.
              </div>
            );
          }
        } else {
          renderPrompt = <div>Searching podcasts for "{this.props.keywords}".</div>;
        }
      } else {
        if (keywords === currentFullQuery) {
          renderPrompt = (
            <div>
              Oops. No matched podcast found. Check on the page below to see matched episodes if
              any. Good luck!
            </div>
          );
        } else {
          renderPrompt = (
            <div>
              Oops. No matched podcast found. Press <code>return</code> to check matched episodes.
              Good luck!
            </div>
          );
        }
      }
    }

    let renderMatches;
    if (matchedPodcasts && matchedPodcasts.length) {
      renderMatches = matchedPodcasts.map(podcast => (
        <PodcastCardStyleB
          key={podcast.id}
          podcast={podcast}
          resetSearchbar={this.props.resetSearchbar}
        />
      ));
    }

    return (
      <header>
        <div className="navbar">
          <div>
            <Link to="/" className="prevent-tap-hl" onClick={this.props.resetSearchbar}>
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
              className="navbar-search-box prevent-tap-hl"
            />
            <div className={displayAndStyle}>
              {renderPrompt}
              {renderMatches}
            </div>
          </div>
          <div className="navbar-links">
            <Link
              to="/me/starred-podcasts"
              className="prevent-tap-hl"
              onClick={this.props.resetSearchbar}
            >
              Starred
            </Link>
            <Link
              to="/me/favorite-episodes"
              className="prevent-tap-hl"
              onClick={this.props.resetSearchbar}
            >
              Favorites
            </Link>
            <Link
              to="/me/play-history"
              className="prevent-tap-hl"
              onClick={this.props.resetSearchbar}
            >
              History
            </Link>
          </div>
          <div className="customize-color any-hover">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill={this.props.customColor}
              />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
            <div className="color-picker">
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#ce0925" className="dot red" />
                <span onClick={this.customizeColor} data-value="#ce0925">
                  Mars Red
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#dd4124" className="dot orange" />
                <span onClick={this.customizeColor} data-value="#dd4124">
                  Warm Orange
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#009874" className="dot emerald" />
                <span onClick={this.customizeColor} data-value="#009874">
                  Lively Emerald
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#ff6f61" className="dot coral" />
                <span onClick={this.customizeColor} data-value="#ff6f61">
                  Playful Coral
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#604c8d" className="dot purple" />
                <span onClick={this.customizeColor} data-value="#604c8d">
                  Mystical Purple
                </span>
              </div>
            </div>
          </div>
          <div className="customize-color no-hover">
            <svg
              onClick={this.toggleColorPicker}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill={this.props.customColor}
              />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
            <div className={styleOnTouchScreenOnly}>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#ce0925" className="dot red" />
                <span onClick={this.customizeColor} data-value="#ce0925">
                  Mars Red
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#dd4124" className="dot orange" />
                <span onClick={this.customizeColor} data-value="#dd4124">
                  Warm Orange
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#009874" className="dot emerald" />
                <span onClick={this.customizeColor} data-value="#009874">
                  Lively Emerald
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#ff6f61" className="dot coral" />
                <span onClick={this.customizeColor} data-value="#ff6f61">
                  Playful Coral
                </span>
              </div>
              <div className="color-option">
                <span onClick={this.customizeColor} data-value="#604c8d" className="dot purple" />
                <span onClick={this.customizeColor} data-value="#604c8d">
                  Mystical Purple
                </span>
              </div>
            </div>
          </div>
          <div className="navbar-menu">
            {toggleMenuIcon}
            <div className={displayMenuItems}>
              <div className="menu-color-picker">
                <span>
                  Color <span style={{ color: this.props.customColor }}>my player</span>
                </span>
                <span>
                  <span onClick={this.customizeColor} data-value="#ce0925" className="dot red" />
                  <span onClick={this.customizeColor} data-value="#dd4124" className="dot orange" />
                  <span
                    onClick={this.customizeColor}
                    data-value="#009874"
                    className="dot emerald"
                  />

                  <span onClick={this.customizeColor} data-value="#ff6f61" className="dot coral" />

                  <span onClick={this.customizeColor} data-value="#604c8d" className="dot purple" />
                </span>
              </div>
              <hr />
              <div className="menu-links">
                <Link
                  to="/me/starred-podcasts"
                  className="prevent-tap-hl"
                  onClick={this.handleClickInMenu}
                >
                  Starred
                </Link>
                <Link
                  to="/me/favorite-episodes"
                  className="prevent-tap-hl"
                  onClick={this.handleClickInMenu}
                >
                  Favorites
                </Link>
                <Link
                  to="/me/play-history"
                  className="prevent-tap-hl"
                  onClick={this.handleClickInMenu}
                >
                  History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
