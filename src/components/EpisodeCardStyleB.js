import React from 'react';

function EpisodeCardStyleB(props) {

// pass the audio details and display audio player.
  function handleClick() {
    const episodeOnPlay = {
      image: props.episode.image,
      episodeId: props.episode.id,
      podcastId: props.episode.podcast_id,
      episodeTitle: props.episode.title_original,
      podcastTitle: props.episode.podcast_title_original,
      audio: props.episode.audio,
      length: props.episode.audio_length,
    };
    props.updateEpisodeOnPlay(episodeOnPlay, props.index);
  }

  function clean(obj) {
    return JSON.parse(
      JSON.stringify(obj)
        .replace(/<\/span>/g, '')
        .replace(/<span class=\\"ln-search-highlight\\">/g, '')
    );
  }

  function highlight(str) {
    return str.split(' ').map((char, i) => {
      if (keywords.toLowerCase().includes(char.toLowerCase())) {
        return (<span key={i} className="hl">{char + ' '}</span>);
      };
      return char + ' ';
    });
  }

  const keywords = props.keywords;
  const {
    description_highlighted:descToHighlight,
    publisher_highlighted:publisherToHighlight,
    podcast_title_highlighted:podcastTitleToHighlight,
    title_highlighted:episodeTitleToHighlight,
    transcripts_highlighted:transcriptsToHighlight,
    image,
    audio_length,
    audio,
    podcast_id,
    pub_date_ms,
    id
  } = clean(props.episode);
  const description = highlight(descToHighlight);
  const publisher = highlight(publisherToHighlight);
  const podcastTitle = highlight(podcastTitleToHighlight);
  const episodeTitle = highlight(episodeTitleToHighlight);
  const transcripts = transcriptsToHighlight.length
    ? highlight(transcriptsToHighlight.join(' ... '))
    : '';
  const date = new Date(pub_date_ms).toDateString();
  let toggleIcon;
  if (audio) {
    toggleIcon = props.index !== props.episodeOnPlayId ?
        'play_circle_outline' :
        props.playing ?
          'pause_circle_outline' :
          'play_circle_outline';
  }
/*
<i
  className="material-icons"
  onClick={handleClick}
>
  {toggleIcon}
</i>
*/

  const length = audio ? audio_length : '(no audio)';

  return (
    <div className="episode-preview">
      <a href={`/${id}`}>
        <img className="artwork-md" src={image} alt="podcast artwork" />
      </a>
      <div>
        <a className="title5" href={`/${id}`}>{episodeTitle}</a>
        <p>
          From <a href={`/${podcast_id}`}>{podcastTitle}</a> by <span>{publisher}</span>
        </p>
        <div>
          <i
            className="material-icons"
            onClick={handleClick}
          >
            {toggleIcon}
          </i>
          <span className="duration">{length}</span>
          <i className="material-icons cursor-none">date_range</i>
          <span className="date">{date}</span>
        </div>
        <p>
          <span><b>Description</b></span>: {description}
        </p>
        <p>
          <span><b>Transcripts</b></span>: ...{transcripts ? transcripts : '(no match found)'}...
        </p>
      </div>
      <audio src={audio}></audio>
    </div>
  )
}

export default EpisodeCardStyleB;
