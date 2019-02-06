import React from 'react';
import PodcastCardStyleB from './PodcastCardStyleB';

function Header(props) {
  const matchedPodcasts = props.matchedPodcasts;
  return (
    <header>
      <div className="navbar-bg">
        <div>
          <a href="/"><span className="navbar-logo">CastAlleys</span></a>
        </div>
        <div className="navbar-search">
          <input className="navbar-search-box" type="text" placeholder="search podcasts" />
          <div className="matched-container1">
            {matchedPodcasts.map((podcast) => (
              <PodcastCardStyleB
                key={podcast.id}
                podcast={podcast}
              />
            ))}
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

export default Header;
