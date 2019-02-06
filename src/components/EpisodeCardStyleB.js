import React from 'react';

// let's try to use variables

function EpisodeCardStyleB(props) {

  function highlight(obj) {
    return JSON.parse(JSON.stringify(obj).replace(/class=/g, 'className='));
  }

  const response = {
    "description_highlighted": "...<span class=\"ln-search-highlight\">Ray</span> <span class=\"ln-search-highlight\">Dalio</span> (@raydalio) grew up a middle-class kid from Long Island.", "podcast_title_original": "The Tim Ferriss Show", "podcast_listennotes_url": "https://www.listennotes.com/c/25212ac3c53240a880dd5032e547047b/", "genres": [144, 157, 88, 90, 93, 94, 97, 98, 111], "podcast_id": "25212ac3c53240a880dd5032e547047b", "pub_date_ms": 1505300006000, "rss": "https://www.listennotes.com/c/r/25212ac3c53240a880dd5032e547047b", "title_original": "Ray Dalio, The Steve Jobs of Investing", "image": "https://d3sv2eduhewoas.cloudfront.net/channel/image/b7c71eae106646e8b1310e53bb2730c8.jpeg", "explicit_content": false, "publisher_highlighted": "Tim Ferriss: Bestselling Author, Human Guinea Pig", "podcast_title_highlighted": "The Tim Ferriss Show", "publisher_original": "Tim Ferriss: Bestselling Author, Human Guinea Pig", "audio_length": "02:06:20", "thumbnail": "https://d3sv2eduhewoas.cloudfront.net/channel/image/b7c71eae106646e8b1310e53bb2730c8.jpeg", "listennotes_url": "https://www.listennotes.com/e/9a4c6f034963469d904447c7cd32b591/", "description_original": "Ray Dalio (@raydalio) grew up a middle-class kid from Long Island. He started his investment company Bridgewater Associates out of a two-bedroom apartment at age 26, and it now has roughly $160 billion in assets under management. Over 42 years, he has built Bridgewater into what Fortune considers the fifth most important private company in the U.S. Along the way, Dalio became one the 100 most influential people in the world (according to Time) and one of the 100 wealthiest people in the world (according to Forbes). Because of his unique investment principles that have changed industries, aiCIO Magazine called him \"the Steve Jobs of investing.\" Ray believes his success is the result of principles he's learned, codified, and applied to his life and business. Those principles are detailed in his new book Principles: Life and Work. In this interview, we cover a lot, including:  How Ray thinks about investment decisions, how he thinks about correlation, etc. The three books he would give to every graduating high school or college senior How he might assess cryptocurrency And much, much more...  Enjoy! This podcast is brought to you by Four Sigmatic.\u00a0I reached out to these Finnish entrepreneurs after a very talented acrobat introduced me to one of their products, which blew my mind (in the best way possible). It is mushroom coffee featuring chaga. It tastes like coffee, but there are only 40 milligrams of caffeine, so it has less than half of what you would find in a regular cup of coffee. I do not get any jitters, acid reflux, or any type of stomach burn. It put me on fire for an entire day, and I only had half of the packet. People are always asking me what I use for cognitive enhancement right now -- this is the answer. You can try it right now by going to\u00a0foursigmatic.com/tim\u00a0and using the code\u00a0Tim\u00a0to get 20 percent off your first order. If you are in the experimental mindset, I do not think you'll be disappointed. This podcast is brought to you by\u00a0Athletic Greens.\u00a0I get asked all the time, \"If you could only use one supplement, what would it be?\" My answer is, inevitably,\u00a0Athletic Greens.\u00a0It is my all-in-one nutritional insurance. I recommended it in\u00a0The 4-Hour Body and did not get paid to do so.\u00a0As a listener of The Tim Ferriss Show, you'll get 30 percent off your first order at\u00a0AthleticGreens.com/Tim. Show notes and links for this episode can be found at\u00a0tim.blog/podcast.", "title_highlighted": "<span class=\"ln-search-highlight\">Ray</span> <span class=\"ln-search-highlight\">Dalio</span>, The Steve Jobs of Investing", "transcripts_highlighted": ["those people come from the worlds of sports from chess from entertainment and in this case from investing I'm very very excited about this conversation you are about to hear I had a blast it is with <span class=\"ln-search-highlight\">Ray</span>", "<span class=\"ln-search-highlight\">dalio</span> who has been called the Steve Jobs of investing and we'll get to why that is the case this is Ray's first longform podcast ever which I'm extremely happy to debut here on Twitter at <span class=\"ln-search-highlight\">Ray</span> <span class=\"ln-search-highlight\">dalio</span> you"], "id": "9a4c6f034963469d904447c7cd32b591", "itunes_id": 863897795, "audio": "https://www.listennotes.com/e/p/9a4c6f034963469d904447c7cd32b591/"};

  const {
    description_highlighted,
    publisher_highlighted,
    podcast_title_highlighted,
    title_highlighted:episode_title_highlighted,
    transcripts_highlighted,
    image,
    audio_length,
    audio,
    podcast_id,
    pub_date_ms,
    id,
    itunes_id,
    description_original
  } = highlight(response);

  const date = new Date(pub_date_ms).toDateString();

  return (
    <div className="episode-preview">
      <a href="/episode-id">
        <img className="artwork-md" src={image} alt="podcast artwork" />
      </a>
      <div>
        <a className="title5" href="/episode_id">{episode_title_highlighted}</a>
        <p>
          From <a href="/podcast_id">{podcast_title_highlighted}</a> by <span>{publisher_highlighted}</span>
        </p>
        <div>
          <i className="material-icons">play_circle_outline</i>
          <span className="duration">{audio_length}</span>
          <i className="material-icons">date_range</i>
          <span className="date">{date}</span>
        </div>
        <p>
          <span><b>Description</b></span>: {description_highlighted}
        </p>
        <p>
          <span><b>Transcripts</b></span>: ...{transcripts_highlighted}...
        </p>
      </div>
      <audio src={audio}></audio>
    </div>
  )
}

export default EpisodeCardStyleB;
