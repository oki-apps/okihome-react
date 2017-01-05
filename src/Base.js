import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { login, logout, setVersion } from './actions'
import logo from './okihome24.png'
import './App.css';

import { Link } from 'react-router'

const mapStateToProps = (state) => {
  return {
    user: state.user,
    tabs: state.tabs,
    apiVersion: state.apiVersion,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginClick: () => {
      dispatch(login({
        user_id: 'simon',
        display_name: 'Simon',
        email: 'simonhege@gmail.com',
      }))
    },
    onLogoutClick: () => {
      dispatch(logout())
      dispatch(push('/'))
    }
  }
}

class Base extends Component {
  
  render() {
    const isLoggedIn = (this.props.user !== null);
    const tabs = this.props.tabs || [];
    const apiVersion = this.props.apiVersion;
    const displayName = this.props.user ? this.props.user.display_name : '';
    
    return (
          <div className="container-fluid">
            <nav className="navbar navbar-fixed-top navbar-light bg-faded">
              <Link to="/" className="navbar-brand" activeClassName="active">
                <img src={logo} width="24" height="24" className="align-baseline" alt="" />{' '}
                Okihome {apiVersion}
              </Link>
              {isLoggedIn ? 
                <div className="nav navbar-nav">
                {tabs.map((tab) =>
                  <Link key={tab.id} to={"/private/tabs/"+ tab.id} className="nav-item nav-link" activeClassName="active">{tab.title} <span className="tag tag-default">{tab.unread_count}</span></Link>
                )}
                </div>
              : null }
              <div className="nav navbar-nav float-xs-right">
                {isLoggedIn ? <Link to="/private/settings" className="nav-item nav-link" activeClassName="active"><i className="fa fa-user fa-fw"></i> {displayName}</Link> : null }
                {isLoggedIn ? <a href="#" onClick={this.props.onLogoutClick} className="nav-item nav-link"><i className="fa fa-sign-out fa-fw"></i> Log out</a> : null }
                {isLoggedIn ? null : <a href="#"  onClick={this.props.onLoginClick} className="nav-item nav-link"><i className="fa fa-sign-in fa-fw"></i> Log in</a> }
                <Link to="/help" className="nav-item nav-link" activeClassName="active"><i className="fa fa-question-circle fa-fw"></i> Help</Link>
              </div>
            </nav>
            {this.props.children}
          </div>
    );
  }
}

Base = connect(mapStateToProps,mapDispatchToProps)(Base)
export default Base;