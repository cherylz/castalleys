import React from 'react';
import { Link } from 'react-router-dom';
import { formatSeconds } from '../helpers';

function EpisodeCardStyleA(props) {
  let audioRef = React.createRef();

  const { episodeTitle, episodeId, image, audio, date, duration } = props.episode;
  const desc = descComponent();
  const playIcon = (
    <svg
      onClick={handleClick}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  );
  const pauseIcon = (
    <svg
      onClick={handleClick}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z" />
    </svg>
  );
  const favIcon = (
    <svg
      onClick={unFavEpisode}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={props.customColor}
      />
    </svg>
  );
  const unFavIcon = (
    <svg
      onClick={favEpisode}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
    </svg>
  );
  const toggleFavIcon = props.faved ? favIcon : unFavIcon;

  let episodeStyle;
  let renderTitle;
  let renderDesc;
  let togglePlayIcon;

  if (props.episodeOnWhichPage === 'podcast') {
    episodeStyle = 'episode';
    renderTitle = (
      <Link to={`/episode/${episodeId}`}>
        <h3>{episodeTitle}</h3>
      </Link>
    );
    renderDesc = <div className="desc">{desc}</div>;
  } else if (props.episodeOnWhichPage === 'episode') {
    episodeStyle = 'episode noBorderBottom';
    renderTitle = <h3>{episodeTitle}</h3>;
    renderDesc = <div>{desc}</div>;
  }

  if (audio) {
    togglePlayIcon =
      episodeId !== props.episodeOnPlayId ? playIcon : props.playing ? pauseIcon : playIcon;
  }

  function createDescMarkup() {
    return { __html: props.episode.desc };
  }
  function descComponent() {
    return <div dangerouslySetInnerHTML={createDescMarkup()} className="inline" />;
  }

  function handleClick() {
    if (episodeId !== props.episodeOnPlayId) {
      // fallback: use original audio length in case audioRef.current.duration returns NaN for unknown reasons.
      const actualDuration = audioRef.current.duration
        ? audioRef.current.duration
        : props.episode.duration;
      const episodeOnPlay = {
        podcastTitle: props.podcastTitle,
        episodeTitle,
        podcastId: props.podcastId,
        episodeId,
        desc: props.episode.desc,
        duration: actualDuration,
        image,
        audio,
        date
      };
      props.updateEpisodeOnPlayAndMaybeActualDuration(episodeOnPlay);
    } else {
      props.updatePlaying();
      // fallback: in case audioRef.current.duration returns NaN on first click, we still have the chance to update the actual duration on subsequent clicks.
      if (audioRef.current.duration && audioRef.current.duration !== props.episode.duration) {
        props.updateActualDuration(audioRef.current.duration);
      }
    }
  }

  function favEpisode() {
    const faved = {
      podcastTitle: props.podcastTitle,
      episodeTitle,
      podcastId: props.podcastId,
      episodeId,
      desc: props.episode.desc,
      duration,
      image,
      audio,
      date
    };
    props.favEpisode(faved);
  }

  function unFavEpisode() {
    props.unFavEpisode(episodeId);
  }

  return (
    <div className={episodeStyle}>
      {renderTitle}
      <p className="date">{date}</p>
      <div className="episode-controls">
        <span className="episode-play-group prevent-tap-hl">
          {togglePlayIcon}
          <span className="duration">
            {duration === '(no audio)' ? duration : formatSeconds(duration)}
          </span>
          {toggleFavIcon}
        </span>
      </div>
      {renderDesc}
      <audio src={audio} ref={audioRef} />
    </div>
  );
}

export default EpisodeCardStyleA;
