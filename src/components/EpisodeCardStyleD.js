import React from 'react';
import { Link } from 'react-router-dom';
import { formatSeconds } from '../helpers';

function EpisodeCardStyleD(props) {
  let audioRef = React.createRef();

  const { podcastTitle, episodeTitle, podcastId, episodeId, image, audio, date } = props.episode;
  const desc = descComponent();
  const durationInHHMMSS = audio ? formatSeconds(props.episode.duration) : '(no audio)';
  const playIcon = (
    <svg
      className="prevent-tap-hl"
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
      className="prevent-tap-hl"
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

  let togglePlayIcon;
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
        podcastTitle,
        episodeTitle,
        podcastId,
        episodeId,
        desc: props.episode.desc, // be aware if we use the const desc instead, React will yell at us, "TypeError: Converting circular structure to JSON"
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

  return (
    <div className="faved-episode">
      <Link to={`/episode/${episodeId}`}>
        <img className="artwork-in-faved" src={image} alt="podcast artwork" />
      </Link>
      <div>
        <Link to={`/episode/${episodeId}`} className="title5">
          {episodeTitle}
        </Link>
        <div className="podcast-title-in-faved">
          From <Link to={`/podcast/${podcastId}`}>{podcastTitle}</Link>
        </div>
        <div>
          {togglePlayIcon}
          <span className="duration">{durationInHHMMSS}</span>
          <svg
            className="cursor-none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
            <path fill="none" d="M0 0h24v24H0z" />
          </svg>
          <span className="date">{date}</span>
          <div className="tooltip-in-faved">
            <svg
              onClick={() => props.unFavEpisode(episodeId)}
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
            <span className="tooltiptext-in-faved">remove</span>
          </div>
        </div>
        <div className="desc-in-faved">{desc}</div>
      </div>
      <audio src={audio} ref={audioRef} />
    </div>
  );
}

export default EpisodeCardStyleD;
