import React from 'react';

class Home extends React.Component {

  // go to the search page
  componentDidUpdate() {
    if (this.props.previousFullQuery !== this.props.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
      this.props.updatePreviousFullQuery();
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
          <a href="mailto:czcodes@gmail.com">
            <i id="email" className="material-icons custom-color shake">email</i>
          </a>
        </footer>
      </div>
    )
  }
}

export default Home;
