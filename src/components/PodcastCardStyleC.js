import React from 'react';
import { Link } from 'react-router-dom';

function PodcastCardStyleC(props) {
  if (!props.podcast) {
    return (
      <div className="show-preview">
        <p>Oops...No match can be found.</p>
      </div>
    );
  } else {
    const {
      id,
      image,
      title_original: title,
      publisher_original: publisher
    } = props.podcast;
    return (
      <div className="show-preview">
        <Link to={`/podcast/${id}`} onClick={props.resetSearchbar}>
          <img className="artwork-md" src={image} alt="podcast artwork" />
        </Link>
        <div className="align">
          <Link
            to={`/podcast/${id}`}
            onClick={props.resetSearchbar}
            className="title3"
          >
            {title}
          </Link>
          <p className="title4">{publisher}</p>
        </div>
      </div>
    );
  }
}

export default PodcastCardStyleC;
