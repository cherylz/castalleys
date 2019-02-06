import React from 'react';

function PodcastCardStyleA(props) {
  return (
    <div className="show">
      <h1>The Knowledge Project with Shane Parrish</h1>
      <img className="artwork" src="https://d3sv2eduhewoas.cloudfront.net/channel/image/bf96db90015f4a408de47dfddc8453cd.png" alt="podcast artwork" />
      <p><em>By</em> Farnam Street</p>
      <button className="subscribe-btn">Subscribe</button>
      <input className="search-in-podcast" type="text" placeholder="search in podcast" />
      <p className="desc">
        The Knowledge Project takes you inside the heads of remarkable people to explore the frameworks and mental models you can use to make life more meaningful and productive. Learn more at <a href="https://fs.blog">https://fs.blog</a>
      </p>
      <div className="podcast-links">
        <a href="https://fs.blog/the-knowledge-project" target="_blank" rel='noreferrer noopener'>Website</a>
        <a href="https://www.listennotes.com/c/r/84dac069e2de4fcfad003ab67b5fab53" target="_blank" rel='noreferrer noopener'>RSS</a>
        <a href="https://itunes.apple.com/podcast/id990149481" target="_blank" rel='noreferrer noopener'>iTunes</a>
      </div>
      <p className="more-info">Total episodes: 50</p>
      <p className="more-info">First published: 20 Jan 2017</p>
      <p className="more-info">Tags: podcasts, health, self-help, business, investing, education, society & culture, philosophy</p>
    </div>
  )
}

export default PodcastCardStyleA;
