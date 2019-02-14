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
      </div>
    )
  }
}

export default Home;
