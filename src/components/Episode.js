import React from 'react';
import Header from './Header';
import PodcastCardStyleA from './PodcastCardStyleA';

//TBD: reuse EpisodeCardStyleA

class Episode extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="page-container">
          <PodcastCardStyleA />
          <div className="episodes">
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
                <p><em>Josh Wolfe, co-founder of Lux Capital discusses how to unearth the unexplored ideas that will reshape our future. We also talk parenting, decision making, and which generation has the best rap.</em></p> <p>---</p> <p>For comprehensive show notes on this episode, including a full edited transcript, go to <a href="https://fs.blog/podcast/">https://fs.blog/podcast/</a></p> <p>Is your brain hungry for more? Don't miss out! Sign up for our weekly "Brain Food" at <a href="https://fs.blog/newsletter/">https://fs.blog/newsletter/</a></p> <p>Follow <a href= "https://twitter.com/farnamstreet">@farnamstreet</a> on Twitter for mind-expanding content.</p>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Episode;
