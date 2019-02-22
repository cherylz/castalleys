import React from 'react';
import { Link } from 'react-router-dom';
import { msToDate } from '../helpers';

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
  const date = msToDate(props.episode.pub_date_ms);
  const duration = audio ? audio_length : '(no audio)';
  const playIcon = (
    <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    </svg>
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
          {toggleIcon}
          <span className="duration">{duration}</span>
          <svg className="cursor-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
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
