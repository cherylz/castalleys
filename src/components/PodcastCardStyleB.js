import React from 'react';
import { Link } from 'react-router-dom';

function PodcastCardStyleB(props) {
  const { id, image, title_original:title, publisher_original:publisher } = props.podcast;

  return (
    <div className="show-preview">
      <Link
        to={{
          pathname: `/podcast/${id}`,
        }}
        onClick={props.handleClick}
      >
        <img className="artwork-sm" src={image} alt="podcast artwork" />
      </Link>
      <div>
        <Link
        to={{
          pathname: `/podcast/${id}`,
        }}
          onClick={props.handleClick}
        >
          {title}
        </Link>
        <p className="title4">{publisher}</p>
      </div>
    </div>
  )
}

export default PodcastCardStyleB;
