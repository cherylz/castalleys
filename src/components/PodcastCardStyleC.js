import React from 'react';

function PodcastCardStyleC(props) {
  if (!props.podcast) {
    return (
      <div className="show-preview">
        <p>Oops...No match can be found.</p>
      </div>
    );
  } else {
    const { id, image, title_original:title, publisher_original:publisher } = props.podcast;
    const link = `/${id}`;
    return (
      <div className="show-preview">
        <a href={link}>
          <img className="artwork-md" src={image} alt="podcast artwork" />
        </a>
        <div className="align">
          <a className="title3" href={link}>{title}</a>
          <p className="title4">{publisher}</p>
        </div>
      </div>
    )
  }
}

export default PodcastCardStyleC;
