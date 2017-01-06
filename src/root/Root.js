import React, { Component } from 'react';

import Navbar from '../navbar/Navbar';

class Base extends Component {
  
  render() {    
    return (
          <div className="container-fluid">
            <Navbar />
            {this.props.children}
          </div>
    );
  }
}

export default Base;