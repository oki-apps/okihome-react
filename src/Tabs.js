import React, { Component } from 'react';

class Tabs extends Component {
  render() {
    return (
          <div className="container-fluid">
            <p>Tabs {this.props.params.tabId}</p>
            {this.props.children}
          </div>
    );
  }
}

export default Tabs;