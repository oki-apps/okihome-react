import React, { Component } from 'react';

class Settings extends Component {
  render() {
    return (
          <div className="container-fluid">
            <p>Settings</p>
            {this.props.children}
          </div>
    );
  }
}

export default Settings;