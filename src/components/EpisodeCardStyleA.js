import React from 'react';
import { Link } from 'react-router-dom';

function EpisodeCardStyleA(props) {
  const { episodeTitle, episodeId, image, audio, desc, date, duration } = props.episode;
  let episodeStyle;
  let renderTitle;
  let renderDesc;
  let toggleIcon;

  if (props.episodeOnWhichPage === 'podcast') {
    episodeStyle = 'episode';
    renderTitle = (
      <Link to={`/episode/${episodeId}`}>
        <h3>{episodeTitle}</h3>
      </Link>
    );
    renderDesc = (
      <p className="desc">
        {desc}
        <span className="more">more</span>
      </p>
    );
  } else if (props.episodeOnWhichPage === 'episode') {
    episodeStyle = 'episode noBorderBottom';
    renderTitle = (<h3>{episodeTitle}</h3>);
    renderDesc = (<p className="desc">{desc}</p>);
  }

  if (audio) {
    toggleIcon = episodeId !== props.episodeOnPlayId ?
        'play_circle_outline' :
        props.playing ?
          'pause_circle_outline' :
          'play_circle_outline';
  }

  function handleClick() {
    if (episodeId !== props.episodeOnPlayId) {
      const episodeOnPlay = {
        podcastId: props.podcastId,
        podcastTitle: props.podcastTitle,
        image,
        episodeId,
        episodeTitle,
        audio,
        duration
      };
      props.updateEpisodeOnPlay(episodeOnPlay);
    } else {
      props.updatePlaying();
    }
  }

  return (
    <div className={episodeStyle}>
      {renderTitle}
      <p className="date">{date}</p>
      <div className="episode-controls">
        <span className="episode-play-group">
          <i
            className="material-icons"
            onClick={handleClick}
          >
            {toggleIcon}
          </i>
          <span className="duration">{duration}</span>
        </span>
        {/*<i className="material-icons">favorite_border</i><i className="material-icons">playlist_add</i>*/}
      </div>
      {renderDesc}
    </div>
  )
}

export default EpisodeCardStyleA;
