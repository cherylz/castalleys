import React from 'react';

function PodcastCardStyleA(props) {
  const { title, image:imageSrc, publisher, description:desc, rss, total_episodes:totalEpisodes } = props.podcast;
  const website = props.podcast.website.replace('?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website', '');
  const itunes = `https://itunes.apple.com/podcast/id${props.podcast.itunes_id}`;
  const firstPublishDate = new Date(props.podcast.earliest_pub_date_ms).toDateString();
  const genresInString = props.podcast.genres.join(', ').toLowerCase() || "n/a";
  let renderSearchBox;
  if (props.podcastOnWhichPage === 'podcast') {
    renderSearchBox = (<input className="search-in-podcast" type="text" placeholder="search in podcast" />);
  }
  return (
    <div className="show">
      <h1>{title}</h1>
      <img className="artwork" src={imageSrc} alt="podcast artwork" />
      <p><em>By</em> {publisher}</p>
      {/* <button className="subscribe-btn">Subscribe</button> */}
      {renderSearchBox}
      <p className="desc">{desc}</p>
      <div className="podcast-links">
        <a href={website} target="_blank" rel='noreferrer noopener'>Website</a>
        <a href={rss} target="_blank" rel='noreferrer noopener'>RSS</a>
        <a href={itunes} target="_blank" rel='noreferrer noopener'>iTunes</a>
      </div>
      <p className="more-info">Total episodes: {totalEpisodes}</p>
      <p className="more-info">First published: {firstPublishDate}</p>
      <p className="more-info">Tags: {genresInString}</p>
    </div>
  )
}

export default PodcastCardStyleA;
