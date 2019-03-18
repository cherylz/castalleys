import React from 'react';
import { Link } from 'react-router-dom';

function PodcastCardStyleD(props) {
  const { image, title, desc, publisher, id } = props.podcast;

  const unstarPodcast = () => {
    props.unstarPodcast(id);
  };

  return (
    <div className="starred-podcast">
      <Link to={`/podcast/${id}`}>
        <img className="artwork-in-starred" src={image} alt="podcast artwork" />
      </Link>
      <div className="info-in-starred">
        <Link to={`/podcast/${id}`} className="title5">
          <h3>{title}</h3>
        </Link>
        <div className="extra-info">
          <span>
            <em>From</em> {publisher}
          </span>
        </div>
        <div className="desc-in-starred">{desc}</div>
      </div>
      <div className="tooltip-in-starred">
        <svg
          onClick={unstarPodcast}
          className="star-in-starred"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={props.customColor}
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
        <span className="tooltiptext-in-starred">unstar</span>
      </div>
    </div>
  );
}

export default PodcastCardStyleD;
