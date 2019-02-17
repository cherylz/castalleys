import React from 'react';

class NotFound extends React.Component {
  componentDidUpdate() {
    console.log('componentDidUpdate');
    if (this.props.previousFullQuery !== this.props.currentFullQuery) {
      console.log('hii');
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
      this.props.updatePreviousFullQuery();
    }
  }
  render() {
    return (
      <div className="not-found-cover">
        <span>Oops! Page not found.</span>
      </div>
    )
  }
}

export default NotFound;
