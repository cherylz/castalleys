import React from 'react';
import { Link } from 'react-router-dom';
import { formatSeconds } from '../helpers';

function EpisodeCardStyleA(props) {
  const { title, id, pub_date_ms, maybe_audio_invalid, audio, audio_length, description: desc } = props.episode;
  const date = new Date(pub_date_ms).toDateString();
  const duration = maybe_audio_invalid ? '(no audio)' : formatSeconds(audio_length);
  let episodeStyle;
  let renderTitle;
  let renderDesc;
  if (props.episodeOnWhichPage === 'podcast') {
    episodeStyle = 'episode';
    renderTitle = (
      <Link
        to={{
          pathname: `/episode/${id}`
        }}
      >
        <h3>{title}</h3>
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
    renderTitle = (<h3>{title}</h3>);
    renderDesc = (<p className="desc">{desc}</p>);
  }

  let toggleIcon;
  if (!maybe_audio_invalid) {
    toggleIcon = props.episode.id !== props.episodeOnPlayId ?
        'play_circle_outline' :
        props.playing ?
          'pause_circle_outline' :
          'play_circle_outline';
  }

  function handleClick() {
    if (props.episode.id !== props.episodeOnPlayId) {
      const episodeOnPlay = {
        podcastId: props.podcastId,
        podcastTitle: props.podcastTitle,
        image: props.episode.image,
        episodeId: props.episode.id,
        episodeTitle: props.episode.title,
        audio: props.episode.audio,
        duration: formatSeconds(props.episode.audio_length)
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
