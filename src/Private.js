import React, { Component } from 'react';

class Private extends Component {
  render() {
    return (
          <div className="container-fluid">
            <p>Private</p>
            {this.props.children}
          </div>
    );
  }
}

export default Private;