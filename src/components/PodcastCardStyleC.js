import React from 'react';
import { Link } from 'react-router-dom';

class PodcastCardStyleC extends React.Component {
  starPodcast = () => {
    this.props.starPodcast({ ...this.props.podcast, starred: true });
  };

  unstarPodcast = () => {
    this.props.unstarPodcast({ ...this.props.podcast, starred: false });
  };

  render() {
    if (!this.props.podcast) {
      return (
        <div className="show-preview-2">
          <p>Oops...No match can be found.</p>
        </div>
      );
    } else {
      const {
        id,
        image,
        title_original: title,
        publisher_original: publisher,
        starred
      } = this.props.podcast;

      const toggleStarIcon = starred ? (
        <svg
          onClick={this.unstarPodcast}
          className="star"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            fill={this.props.customColor}
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      ) : (
        <svg
          onClick={this.starPodcast}
          className="unstar"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"
            fill="#808080"
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      );

      return (
        <div className="show-preview-2">
          <div>{toggleStarIcon}</div>
          <Link to={`/podcast/${id}`} onClick={this.props.resetSearchbar}>
            <img className="artwork-md" src={image} alt="podcast artwork" />
          </Link>
          <div className="align">
            <Link
              to={`/podcast/${id}`}
              onClick={this.props.resetSearchbar}
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
}

export default PodcastCardStyleC;
