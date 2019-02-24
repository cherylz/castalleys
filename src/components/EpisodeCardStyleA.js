import React from 'react';
import { Link } from 'react-router-dom';

function EpisodeCardStyleA(props) {
  const { episodeTitle, episodeId, image, audio, date, duration } = props.episode;
  const desc = descComponent();
  const playIcon = (
    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
  );
  const pauseIcon = (
    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"/></svg>
  );
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
    renderDesc = (<div className="desc">{desc}</div>);
  } else if (props.episodeOnWhichPage === 'episode') {
    episodeStyle = 'episode noBorderBottom';
    renderTitle = (<h3>{episodeTitle}</h3>);
    renderDesc = (<div>{desc}</div>);
  }

  if (audio) {
    toggleIcon = episodeId !== props.episodeOnPlayId ?
        playIcon :
        props.playing ?
          pauseIcon :
          playIcon;
  }

  function createDescMarkup() {
    return {__html: props.episode.desc};
  }
  function descComponent() {
    return <div dangerouslySetInnerHTML={createDescMarkup()} className='inline' />;
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
        <span className="episode-play-group prevent-tap-hl">
          {toggleIcon}
          <span className="duration">{duration}</span>
        </span>
      </div>
      {renderDesc}
    </div>
  )
}

export default EpisodeCardStyleA;
