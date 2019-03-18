import React from 'react';
import { Link } from 'react-router-dom';
import EpisodeCardStyleD from './EpisodeCardStyleD';

class FavoriteEpisodes extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  //TBC
  unFavEpisode = id => {
    // update this.state.favedEpisodes in App.js and remove the un-favorited episode from localStorage
    const updatedEpisodes = this.props.favedEpisodes.filter(
      episode => episode.episodeId !== id
    );
    this.props.updateFavedEpisodes(updatedEpisodes);
  };

  render() {
    const favedEpisodes = this.props.favedEpisodes;
    let renderFavedEpisodes = <div className="no-match-prompt">Loading...</div>;
    if (favedEpisodes.length) {
      renderFavedEpisodes = favedEpisodes.map(episode => (
        <EpisodeCardStyleD
          key={episode.episodeId}
          episode={episode}
          customColor={this.props.customColor}
          episodeOnPlayId={this.props.episodeOnPlayId}
          playing={this.props.playing}
          updateEpisodeOnPlayAndMaybeActualDuration={
            this.props.updateEpisodeOnPlay
          }
          updateActualDuration={this.props.updateActualDurationOfEpisodeOnPlay}
          updatePlaying={this.props.updatePlaying}
          unFavEpisode={this.props.removeFavedEpisode}
        />
      ));
    } else {
      renderFavedEpisodes = (
        <div className="no-match-prompt">
          You don't have a favorite episode yet. Why not start now? :)
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="user-dashboard">
          <div className="dashboard-options">
            <Link to="/me/starred-podcasts">Starred</Link>
            <Link to="/me/favorite-episodes" className="active-option">
              Favorites
            </Link>
            <Link to="/me/played-episodes">History</Link>
          </div>
          <div className="dashboard-content">{renderFavedEpisodes}</div>
        </div>
      </div>
    );
  }
}

export default FavoriteEpisodes;
