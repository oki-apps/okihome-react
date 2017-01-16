import React, { Component } from 'react';

import Navbar from '../navbar/Navbar';

class Root extends Component {
  
  render() {  
    console.debug('Root', this.props)
    return (
          <div className="container-fluid">
            <Navbar pathParams={this.props.params} />
            {this.props.children}
          </div>
    );
  }
}

export default Root;