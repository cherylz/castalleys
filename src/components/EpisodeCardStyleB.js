import React from 'react';
import { Link } from 'react-router-dom';

function EpisodeCardStyleB(props) {

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

  function createPodcastTitleMarkup() {
    return {__html: props.episode.podcast_title_highlighted};
  }
  function podcastTitleComponent() {
    return <div dangerouslySetInnerHTML={createPodcastTitleMarkup()} className='inline' />;
  }

  function createPublisherMarkup() {
    return {__html: props.episode.publisher_highlighted};
  }
  function publisherComponent() {
    return <div dangerouslySetInnerHTML={createPublisherMarkup()} className='inline' />;
  }

  function createTranscriptsMarkup() {
    return {__html: props.episode.transcripts_highlighted.join(' ... ')};
  }
  function transcriptsComponent() {
    return <div dangerouslySetInnerHTML={createTranscriptsMarkup()} className='inline' />;
  }

  const episodeTitle = episodeTitleComponent();
  const podcastTitle = podcastTitleComponent();
  const publisher = publisherComponent();
  const desc = descComponent();
  const transcripts = transcriptsComponent();

  const { image, audio_length, audio, podcast_id:podcastId, id:episodeId } = props.episode;
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

  function handleClick() {
    if (episodeId !== props.episodeOnPlayId) {
      const episodeOnPlay = {
        podcastTitle: props.episode.podcast_title_original,
        episodeTitle: props.episode.title_original,
        duration: props.episode.audio_length,
        podcastId,
        episodeId,
        image,
        audio
      };
      props.updateEpisodeOnPlay(episodeOnPlay);
    } else {
      props.updatePlaying();
    }
  }

  return (
    <div className="episode-preview">
      <Link
        to={`/podcast/${podcastId}`}
        onClick={props.clearInputInHeader}
      >
        <img className="artwork-md" src={image} alt="podcast artwork" />
      </Link>
      <div>
        <Link
          to={`/episode/${episodeId}`}
          onClick={props.clearInputInHeader}
          className="title5"
        >
          {episodeTitle}
        </Link>
        <div>
          From{' '}
          <Link
            to={`/podcast/${podcastId}` }
            onClick={props.clearInputInHeader}
          >
            {podcastTitle}
          </Link>
           {' '}by <span>{publisher}</span>
        </div>
        <div>
          <i
            className="material-icons"
            onClick={handleClick}
          >
            {toggleIcon}
          </i>
          <span className="duration">{duration}</span>
          <i className="material-icons cursor-none">date_range</i>
          <span className="date">{date}</span>
        </div>
        <div>
          <span><b>Description</b></span>: {desc}...
        </div>
        <div>
          <span><b>Transcripts</b></span>: ...{transcripts}...
        </div>
      </div>
    </div>
  )
}

export default EpisodeCardStyleB;
