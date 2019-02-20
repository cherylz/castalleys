import React from 'react';

class NotFound extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.currentFullQuery !== prevProps.currentFullQuery) {
      const keywords = this.props.currentFullQuery;
      this.props.history.push(`/search/${keywords}`);
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
