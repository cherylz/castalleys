import React from 'react';

class Home extends React.Component {

  // go to the search page
  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
    }
  }

  render() {
    return (
      <div>
        <div className="home-cover">
          <span>Just search and play.</span>
          <span>Wander around the alleys of podcasts.</span>
        </div>
        <footer>
          <span>This website is a fun project built by Cheryl. If you like it, email to say hi =)</span>
          <a href="mailto:czcodes@gmail.com" className="shake" id="email">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill={this.props.customColor}/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </a>
        </footer>
      </div>
    )
  }
}

export default Home;
