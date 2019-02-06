import React from 'react';

function PodcastCardStyleB(props) {
  const { id, image, title_original:title, publisher_original:publisher } = props.podcast;
  const link = `/${id}`;
  return (
    <div className="show-preview">
      <a href={link}>
        <img className="artwork-sm" src={image} alt="podcast artwork" />
      </a>
      <div>
        <a className="title3" href={link}>{title}</a>
        <p className="title4">{publisher}</p>
      </div>
    </div>
  )
}

export default PodcastCardStyleB;
