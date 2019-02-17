import React from 'react';
import { Link } from 'react-router-dom';

function EpisodeCardStyleC(props) {
  const { podcast_title_original:podcastTitle, podcast_id:podcastId, id:episodeId, image, audio, audio_length } = props.episode;
  const episodeTitle = episodeTitleComponent();
  const desc = descComponent();
  const transcripts = transcriptsComponent();
  const date = new Date(props.episode.pub_date_ms).toDateString();
  const duration = audio ? audio_length : '(no audio)';
  let toggleIcon;

  if (audio) {
    toggleIcon = episodeId !== props.episodeOnPlayId ?
        'play_circle_outline' :
        props.playing ?
          'pause_circle_outline' :
          'play_circle_outline';
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
