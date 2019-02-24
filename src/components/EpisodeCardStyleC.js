import React from 'react';
import { Link } from 'react-router-dom';
import { msToDate } from '../helpers';

function EpisodeCardStyleC(props) {
  const { podcast_title_original:podcastTitle, podcast_id:podcastId, id:episodeId, image, audio, audio_length } = props.episode;
  const episodeTitle = episodeTitleComponent();
  const desc = descComponent();
  const transcripts = transcriptsComponent();
  const date = msToDate(props.episode.pub_date_ms);
  const duration = audio ? audio_length : '(no audio)';
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
      const episodeOnPlay = { podcastId, podcastTitle, image, episodeId, episodeTitle, audio, duration };
      props.updateEpisodeOnPlay(episodeOnPlay);
    } else {
      props.updatePlaying();
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
    </div>
  )
}

export default EpisodeCardStyleC;
