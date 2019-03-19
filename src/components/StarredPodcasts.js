import React from 'react';
import { Link } from 'react-router-dom';
import PodcastCardStyleD from './PodcastCardStyleD';

class StarredPodcasts extends React.Component {
  state = {
    starredPodcasts: []
  };

  componentDidMount() {
    const starredPodcastsRef = localStorage.getItem('starredPodcasts');
    if (starredPodcastsRef && starredPodcastsRef !== '[]') {
      this.setState({
        starredPodcasts: JSON.parse(starredPodcastsRef)
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  unstarPodcast = id => {
    // update the unstarred status in this.state.starredPodcasts so the unstarred podcast disappears from the page
    const updatedPodcasts = this.state.starredPodcasts.filter(
      podcast => podcast.id !== id
    );
    this.setState({
      starredPodcasts: updatedPodcasts
    });

    // remove the unstarred podcast from localStorage
    const lastStored = JSON.parse(localStorage.getItem('starredPodcasts'));
    const updated = lastStored.filter(item => item.id !== id);
    localStorage.setItem('starredPodcasts', JSON.stringify(updated));
  };

  render() {
    const starredPodcasts = this.state.starredPodcasts;
    let renderStarredPodcasts = (
      <div className="no-match-prompt">Loading...</div>
    );
    if (starredPodcasts.length) {
      renderStarredPodcasts = starredPodcasts.map(podcast => (
        <PodcastCardStyleD
          podcast={podcast}
          key={podcast.id}
          customColor={this.props.customColor}
          unstarPodcast={this.unstarPodcast}
        />
      ));
    } else {
      renderStarredPodcasts = (
        <div className="no-match-prompt">
          You haven't starred a podcast yet. Why not start now? :)
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="user-dashboard">
          <div className="dashboard-options">
            <Link to="/me/starred-podcasts" className="active-option">
              Starred
            </Link>
            <Link to="/me/favorite-episodes">Favorites</Link>
            <Link to="/me/play-history">History</Link>
          </div>
          <div className="dashboard-content">{renderStarredPodcasts}</div>
        </div>
      </div>
    );
  }
}

export default StarredPodcasts;
