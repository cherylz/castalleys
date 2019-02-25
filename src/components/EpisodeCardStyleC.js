import React from 'react';
import { Link } from 'react-router-dom';
import { formatSeconds } from '../helpers';

function EpisodeCardStyleC(props) {
  let audioRef = React.createRef();

  const { podcast_title_original:podcastTitle, podcast_id:podcastId, id:episodeId, image, audio, duration, date } = props.episode;
  const episodeTitle = episodeTitleComponent();
  const desc = descComponent();
  const transcripts = transcriptsComponent();
  const playIcon = (
    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
  );
  const pauseIcon = (
    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"/></svg>
  );
  let toggleIcon;

  if (audio) {
    toggleIcon = episodeId !== props.episodeOnPlayId ?
        playIcon :
        props.playing ?
          pauseIcon :
          playIcon;
  }

  function createEpisodeTitleMarkup() {
    return {__html: props.episode.title_highlighted};
  }
  function episodeTitleComponent() {
    return <div dangerouslySetInnerHTML={createEpisodeTitleMarkup()} className='inline' />;
  }

  function createDescMarkup() {
    return {__html: props.episode.description_highlighted};
  }
  function descComponent() {
    return <div dangerouslySetInnerHTML={createDescMarkup()} className='inline' />;
  }

  function createTranscriptsMarkup() {
    return {__html: props.episode.transcripts_highlighted.join(' ... ')};
  }
  function transcriptsComponent() {
    return <div dangerouslySetInnerHTML={createTranscriptsMarkup()} className='inline' />;
  }

  function handleClick() {
    if (episodeId !== props.episodeOnPlayId) {
      // fallback: use original audio length in case audioRef.current.duration returns NaN for unknown reasons.
      const actualDuration = audioRef.current.duration ? formatSeconds(audioRef.current.duration) : props.episode.duration;
      const episodeOnPlay = {
        episodeTitle: props.episode.title_original,
        duration: actualDuration,
        podcastId,
        podcastTitle,
        image,
        episodeId,
        audio
      };
      console.log('sunny');
      console.log(episodeOnPlay);
      props.updateEpisodeOnPlayAndMaybeActualDuration(episodeOnPlay);
    } else {
      props.updatePlaying();
      // fallback: in case audioRef.current.duration returns NaN on first click, we still have the chance to update the actual duration on subsequent clicks.
      if (audioRef.current.duration && formatSeconds(audioRef.current.duration) !== props.episode.duration) {
        props.updateActualDuration(formatSeconds(audioRef.current.duration), episodeId);
      }
    }
  }

  return (
    <div className="episode">
      <Link to={`/episode/${episodeId}`}>
        <h3>{episodeTitle}</h3>
      </Link>
      <p className="date">{date}</p>
      <div className="episode-controls">
        <span className="episode-play-group prevent-tap-hl">
          {toggleIcon}
          <span className="duration">{duration}</span>
        </span>
      </div>
      <div>
        <span><b>Description</b></span>: {desc}...
      </div>
      <div>
        <span><b>Transcripts</b></span>: ...{transcripts}...
      </div>
      <audio src={audio} ref={audioRef}></audio>
    </div>
  )
}

export default EpisodeCardStyleC;
