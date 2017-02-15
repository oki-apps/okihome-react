import React, { Component } from 'react';

import Navbar from '../navbar/Navbar';

class Root extends Component {
  
  render() {  
    return (
          <div className="container-fluid">
            <Navbar pathParams={this.props.params} />
            {this.props.children}
          </div>
    );
  }
}

export default Root;