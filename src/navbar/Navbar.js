import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import logo from './okihome24.png'
import './Navbar.css';

import userManager from '../userManager';

import { fetchVersion, fetchUser, addTab } from '../actions'
import { getApiVersion, getAllTabs } from '../reducers'

import { Link } from 'react-router'

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.handleNewTabSubmit = this.handleNewTabSubmit.bind(this);
    this.handleNewTabClick = this.handleNewTabClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchVersion();
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
      this.props.fetchUser(currentSub);
    }
  }

  handleNewTabSubmit(event) {
    this.props.onNewTabClick(event, this.inputNewTabTitle.value);
    event.preventDefault();
  }

  handleNewTabClick(event) {
    this.props.onNewTabClick(event, this.inputNewTabTitle.value);
  }

  render() {
    const isLoggedIn = (this.props.oidc.user !== null);
    const isOnTab = (this.props.pathParams && this.props.pathParams.tabId);
    const tabId = isOnTab ? this.props.pathParams.tabId : null;
    const tabs = this.props.tabs || [];
    const apiVersion = this.props.apiVersion;
    const displayName = this.props.oidc.user ? this.props.oidc.user.profile.name : '';
        
    return (
      <div>
        <div className="modal fade" id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle"><i className="fa fa-plus-circle fa-fw"></i> New tab</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleNewTabClick}>
                  <div className="form-group">
                    <label htmlFor="inputTitle">Title</label>
                    <input type="text" className="form-control" id="inputTitle" placeholder="Tab title" autoFocus ref={(input) => this.inputNewTabTitle = input} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="btn-group" role="group" aria-label="Actions">
                  <button type="button" className="btn btn-primary" onClick={this.handleNewTabClick} data-dismiss="modal">OK</button>
                  <button type="button" className="btn btn-warning" data-dismiss="modal">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="navbar navbar-fixed-top navbar-light bg-faded">
          <Link to="/" className="navbar-brand" activeClassName="active">
            <img src={logo} width="24" height="24" className="align-baseline" alt="" />{' '}
            Okihome {apiVersion}
          </Link>
          {isLoggedIn ? 
            <div className="nav navbar-nav">
            {tabs.map((tab) =>
              <Link key={tab.id} to={"/tabs/"+ tab.id} className="nav-item nav-link" activeClassName="active">
                {tab.title} <span className="tag tag-default">{tab.unread_count}</span>
              </Link>
            )}
              <div className="nav-item dropdown">
                <a className="nav-link" href="#" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fa fa-plus fa-fw"></i>
                </a>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {isOnTab ? <a className="dropdown-item" href="#"><i className="fa fa-rss fa-fw"></i> Add feed</a> : null }
                  {isOnTab ? <a className="dropdown-item" href="#"><i className="fa fa-envelope-o fa-fw"></i> Add email</a> : null }
                  {isOnTab ? <div className="dropdown-divider"></div> : null }
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target="#exampleModalLong"><i className="fa fa-plus-circle fa-fw"></i> New tab</a>
                </div>
              </div>
            </div>
          : null }
          <div className="nav navbar-nav float-xs-right">
            {isOnTab ? <Link to={"/tabs/"+tabId+"/settings"} className="nav-item nav-link" activeClassName="active"><i className="fa fa-edit fa-fw"></i> Tab settings</Link> : null }
            {isLoggedIn ? <Link to="/settings" className="nav-item nav-link" activeClassName="active"><i className="fa fa-user fa-fw"></i> {displayName}</Link> : null }
            {isLoggedIn ? <a href="#" onClick={this.props.onLogoutClick} className="nav-item nav-link"><i className="fa fa-sign-out fa-fw"></i> Log out</a> : null }
            {isLoggedIn ? null : <a href="#"  onClick={this.props.onLoginClick} className="nav-item nav-link"><i className="fa fa-sign-in fa-fw"></i> Log in</a> }
            <Link to="/help" className="nav-item nav-link" activeClassName="active"><i className="fa fa-question-circle fa-fw"></i> Help</Link>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tabs: getAllTabs(state),
  apiVersion: getApiVersion(state),
  oidc: state.oidc,
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (userId) =>{
     dispatch(fetchUser(userId))
  },
  fetchVersion: () =>{
     dispatch(fetchVersion())
  },
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
  onNewTabClick : (event, userId, newTabTitle) => {
    dispatch(addTab(userId, newTabTitle));
  }
})

Navbar = connect(mapStateToProps,mapDispatchToProps)(Navbar)
export default Navbar;