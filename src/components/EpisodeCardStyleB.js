import React from 'react';
import { Link } from 'react-router-dom';
import { msToDate, formatSeconds } from '../helpers';

function EpisodeCardStyleB(props) {
  let audioRef = React.createRef();

  const episodeTitle = episodeTitleComponent();
  const podcastTitle = podcastTitleComponent();
  const publisher = publisherComponent();
  const desc = descComponent();
  const transcripts = transcriptsComponent();
  const {
    image,
    audio_length,
    audio,
    podcast_id: podcastId,
    id: episodeId
  } = props.episode;
  const date = msToDate(props.episode.pub_date_ms);
  const duration = audio ? audio_length : '(no audio)';
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

  let togglePlayIcon;
  if (audio) {
    togglePlayIcon =
      episodeId !== props.episodeOnPlayId
        ? playIcon
        : props.playing
          ? pauseIcon
          : playIcon;
  }

  function createEpisodeTitleMarkup() {
    return { __html: props.episode.title_highlighted };
  }
  function episodeTitleComponent() {
    return (
      <div
        dangerouslySetInnerHTML={createEpisodeTitleMarkup()}
        className="inline"
      />
    );
  }

  function createDescMarkup() {
    return { __html: props.episode.description_highlighted };
  }
  function descComponent() {
    return (
      <div dangerouslySetInnerHTML={createDescMarkup()} className="inline" />
    );
  }

  function createPodcastTitleMarkup() {
    return { __html: props.episode.podcast_title_highlighted };
  }
  function podcastTitleComponent() {
    return (
      <div
        dangerouslySetInnerHTML={createPodcastTitleMarkup()}
        className="inline"
      />
    );
  }

  function createPublisherMarkup() {
    return { __html: props.episode.publisher_highlighted };
  }
  function publisherComponent() {
    return (
      <div
        dangerouslySetInnerHTML={createPublisherMarkup()}
        className="inline"
      />
    );
  }

  function createTranscriptsMarkup() {
    return { __html: props.episode.transcripts_highlighted.join(' ... ') };
  }
  function transcriptsComponent() {
    return (
      <div
        dangerouslySetInnerHTML={createTranscriptsMarkup()}
        className="inline"
      />
    );
  }

  function handleClick() {
    if (episodeId !== props.episodeOnPlayId) {
      // fallback: use original audio length in case audioRef.current.duration returns NaN for unknown reasons.
      const actualDuration = audioRef.current.duration
        ? formatSeconds(audioRef.current.duration)
        : props.episode.audio_length;
      const episodeOnPlay = {
        podcastTitle: props.episode.podcast_title_original,
        episodeTitle: props.episode.title_original,
        podcastId,
        episodeId,
        desc: props.episode.description_original,
        duration: actualDuration,
        image,
        audio,
        date
      };
      props.updateEpisodeOnPlayAndMaybeActualDuration(episodeOnPlay);
    } else {
      props.updatePlaying();
      // fallback: in case audioRef.current.duration returns NaN on first click, we still have the chance to update the actual duration on subsequent clicks.
      if (
        audioRef.current.duration &&
        formatSeconds(audioRef.current.duration) !== props.episode.audio_length
      ) {
        props.updateActualDuration(
          formatSeconds(audioRef.current.duration),
          episodeId
        );
      }
    }
  }

  function favEpisode() {
    const faved = {
      podcastTitle: props.episode.podcast_title_original,
      episodeTitle: props.episode.title_original,
      podcastId,
      episodeId,
      desc: props.episode.description_original,
      duration: audio_length,
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
    <div className="episode-preview">
      <Link to={`/podcast/${podcastId}`} onClick={props.resetSearchbar}>
        <img className="artwork-md" src={image} alt="podcast artwork" />
      </Link>
      <div>
        <Link
          to={`/episode/${episodeId}`}
          onClick={props.resetSearchbar}
          className="title5"
        >
          {episodeTitle}
        </Link>
        <div>
          From{' '}
          <Link to={`/podcast/${podcastId}`} onClick={props.resetSearchbar}>
            {podcastTitle}
          </Link>{' '}
          by <span>{publisher}</span>
        </div>
        <div>
          {togglePlayIcon}
          <span className="duration">{duration}</span>
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
          {toggleFavIcon}
        </div>
        <div>
          <span>
            <b>Description</b>
          </span>
          : {desc}...
        </div>
        <div>
          <span>
            <b>Transcripts</b>
          </span>
          : ...{transcripts}...
        </div>
      </div>
      <audio src={audio} ref={audioRef} />
    </div>
  );
}

export default EpisodeCardStyleB;
