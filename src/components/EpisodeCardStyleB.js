import React from 'react';

function EpisodeCardStyleB(props) {

  function clean(obj) {
    return JSON.parse(
      JSON.stringify(obj)
        .replace(/<\/span>/g, '')
        .replace(/<span class=\\"ln-search-highlight\\">/g, '')
    );
  }

  function highlight(str) {
    return str.split(' ').map((char, i) => {
      if (keywordsArr.indexOf(char.toLowerCase()) !== -1) {
        return (<span key={i}><span className="hl">{char}</span>{' '}</span>);
      };
      return char + ' ';
    });
  }

  const keywordsArr = props.currentFullQuery.toLowerCase().split(' '); // TBC: may try Regex. a) doesn't work with punctuation such as 'WWF,'. b) only works with English or English-alike characters. i.e. doesn't work for all languages such as Chinese whose characters are not divided by space.
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
  const duration = audio ? audio_length : '(no audio)';
  let toggleIcon;
  if (audio) {
    toggleIcon = props.episode.id !== props.episodeOnPlayId ?
        'play_circle_outline' :
        props.playing ?
          'pause_circle_outline' :
          'play_circle_outline';
  }

  function handleClick() {
    if (props.episode.id !== props.episodeOnPlayId) {
      const episodeOnPlay = {
        image: props.episode.image,
        episodeId: props.episode.id,
        podcastId: props.episode.podcast_id,
        episodeTitle: props.episode.title_original,
        podcastTitle: props.episode.podcast_title_original,
        audio: props.episode.audio,
        duration: props.episode.audio_length
      };
      props.updateEpisodeOnPlay(episodeOnPlay);
    } else {
      props.updatePlaying();
    }
  }

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
          <span className="duration">{duration}</span>
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
