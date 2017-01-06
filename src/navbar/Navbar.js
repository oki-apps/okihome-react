import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import logo from './okihome24.png'
import './Navbar.css';

import userManager from '../userManager';

import { fetchVersion, fetchUser } from '../actions'
import { getApiVersion, getAllTabs } from '../reducers'

import { Link } from 'react-router'

class BasicNavbar extends Component {

  render() {
    const isLoggedIn = (this.props.oidc.user !== null);
    const tabs = this.props.tabs || [];
    const apiVersion = this.props.apiVersion;
    const displayName = this.props.oidc.user ? this.props.oidc.user.profile.name : '';
        
    return (
      <nav className="navbar navbar-fixed-top navbar-light bg-faded">
        <Link to="/" className="navbar-brand" activeClassName="active">
          <img src={logo} width="24" height="24" className="align-baseline" alt="" />{' '}
          Okihome {apiVersion}
        </Link>
        {isLoggedIn ? 
          <div className="nav navbar-nav">
          {tabs.map((tab) =>
            <Link key={tab.id} to={"/tabs/"+ tab.id} className="nav-item nav-link" activeClassName="active">{tab.title} <span className="tag tag-default">{tab.unread_count}</span></Link>
          )}
          </div>
        : null }
        <div className="nav navbar-nav float-xs-right">
          {isLoggedIn ? <Link to="/settings" className="nav-item nav-link" activeClassName="active"><i className="fa fa-user fa-fw"></i> {displayName}</Link> : null }
          {isLoggedIn ? <a href="#" onClick={this.props.onLogoutClick} className="nav-item nav-link"><i className="fa fa-sign-out fa-fw"></i> Log out</a> : null }
          {isLoggedIn ? null : <a href="#"  onClick={this.props.onLoginClick} className="nav-item nav-link"><i className="fa fa-sign-in fa-fw"></i> Log in</a> }
          <Link to="/help" className="nav-item nav-link" activeClassName="active"><i className="fa fa-question-circle fa-fw"></i> Help</Link>
        </div>
      </nav>
    );
  }
}

class ActiveNavbar extends Component {
  componentDidMount() {
    this.props.dispatch(fetchVersion());
  }

  componentDidUpdate(prevProps) {
    let prevSub = null;
    if (prevProps.oidc && prevProps.oidc.user && prevProps.oidc.user.profile) {
      prevSub = prevProps.oidc.user.profile.sub;
    }
    let currentSub = null;
    if (this.props.oidc && this.props.oidc.user && this.props.oidc.user.profile) {
      currentSub = this.props.oidc.user.profile.sub;
    }
    if(currentSub !== prevSub && currentSub) {
      this.props.dispatch(fetchUser(currentSub));
    }
  }

  render() {
    return <BasicNavbar {...this.props} />;
  }
}

const mapStateToProps = (state) => ({
  tabs: getAllTabs(state),
  apiVersion: getApiVersion(state),
  oidc: state.oidc,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
  onLoginClick : (event) => {
    event.preventDefault();
    userManager.signinRedirect({ data: {
        redirectUrl: window.location.pathname
      }
    });
  },
  onLogoutClick : (event) => {
    event.preventDefault();
    userManager.removeUser();
    dispatch(push('/'));
  },
})

const Navbar = connect(mapStateToProps,mapDispatchToProps)(ActiveNavbar)
export default Navbar;