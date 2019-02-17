import React from 'react';
import { Link } from 'react-router-dom';

function PodcastCardStyleB(props) {
  const { id, image, title_original:title, publisher_original:publisher } = props.podcast;

  return (
    <div className="show-preview">
      <Link
        to={`/podcast/${id}`}
        onClick={props.resetSearchbar}
      >
        <img className="artwork-sm" src={image} alt="podcast artwork" />
      </Link>
      <div>
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
  )
}

export default PodcastCardStyleB;
