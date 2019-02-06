import React from 'react';

function EpisodeCardStyleA(props) {
  return (
    <div className="episode">
      <h3>Inventing the Future</h3>
      <p className="date">Jan. 22, 2019</p>
      <div className="episode-controls">
        <span className="episode-play-group">
          <i className="material-icons">play_circle_outline</i>
          <span className="duration">02:30:02</span>
        </span>
        <i className="material-icons">favorite_border</i>
        <i className="material-icons">playlist_add</i>
      </div>
      <p className="desc">
        Josh Wolfe, co-founder of Lux Capital discusses how to unearth the unexplored ideas that will reshape our future. We also talk parenting, decision...
        <a className="more" href="/podcast_id/episode_id">more</a>
      </p>
    </div>
  )
}

export default EpisodeCardStyleA;
