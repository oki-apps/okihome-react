import React, { Component } from 'react';

import { Link } from 'react-router'

class Home extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-header">Okihome gives you instant access to the world</div>
          <div className="card-block">
            <ul>
              <li>Muti-tab view</li>
              <li>Mark items as read</li>
              <li>Automatic refresh</li>
              <li>Statistics</li>
            </ul>
            <p><Link to="/about" className="nav-item nav-link" activeClassName="active">About</Link></p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <div className="card">
              <div className="card-header">Supported providers</div>
              <div className="card-block">
                <ul className="fa-ul">
                  <li><i className="fa fa-rss fa-fw"></i> RSS/Atom feeds</li>
                  <li><i className="fa fa-envelope-o fa-fw"></i> Email (Gmail, Outlook.com)</li>
                  <li><i className="fa fa-twitter fa-fw"></i> Twitter</li>
                  <li><i className="fa fa-facebook fa-fw"></i> Facebook</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card">
              <div className="card-header">No sign up process</div>
              <div className="card-block">
                <p>There is no special registration process. Simply connect with any account you already have.
                Supported providers are Google, Facebook, Github, ...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
