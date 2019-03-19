import React from 'react';
import { Link } from 'react-router-dom';
import EpisodeCardStyleE from './EpisodeCardStyleE';

class PlayHistory extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  render() {
    const playHistory = this.props.playHistory;
    let renderPlayHistory = <div className="no-match-prompt">Loading...</div>;
    if (playHistory.length) {
      renderPlayHistory = playHistory.map(episode => {
        const faved =
          this.props.favedEpisodesIds.indexOf(episode.episodeId) !== -1;
        return (
          <EpisodeCardStyleE
            key={episode.episodeId}
            episode={episode}
            updateEpisodeOnPlayAndMaybeActualDuration={
              this.props.updateEpisodeOnPlay
            }
            updateActualDuration={
              this.props.updateActualDurationOfEpisodeOnPlay
            }
            episodeOnPlayId={this.props.episodeOnPlayId}
            playing={this.props.playing}
            updatePlaying={this.props.updatePlaying}
            customColor={this.props.customColor}
            faved={faved}
            favEpisode={this.props.addFavedEpisode}
            unFavEpisode={this.props.removeFavedEpisode}
            removeFromHistory={this.props.removeFromHistory}
          />
        );
      });
    } else {
      renderPlayHistory = (
        <div className="no-match-prompt">
          You haven't played an episode yet. Why not start now? :)
        </div>
      );
    }

    return (
      <div className="page-container">
        <div className="user-dashboard">
          <div className="dashboard-options">
            <Link to="/me/starred-podcasts">Starred</Link>
            <Link to="/me/favorite-episodes">Favorites</Link>
            <Link to="/me/play-history" className="active-option">
              History
            </Link>
          </div>
          <div className="dashboard-content">{renderPlayHistory}</div>
        </div>
      </div>
    );
  }
}

export default PlayHistory;
