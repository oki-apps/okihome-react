import React, { Component } from 'react';
import { connect } from 'react-redux'

import { fetchServices, fetchAccounts, revokeAccount } from '../actions'
import { getUserId, getApiToken, getServices, getAccounts } from '../reducers'

import { connectAccount } from '../okihomeApi'

class Settings extends Component {

  componentDidMount() {
    this.props.fetchServices();
    if(this.props.userId) {
      this.props.fetchAccounts(this.props.userId);
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.userId !== this.props.userId && this.props.userId) {
      this.props.fetchAccounts(this.props.userId);
    }
  }

  render() {
    const userId = this.props.userId;
    const token = this.props.token;
    const services = this.props.services || [];
    const accounts = this.props.accounts || [];

    return (
      <div className="container">
        <div className="card">
            <div className="card-header">Connected accounts</div>
            <div className="card-block">
              {accounts.length>0 ?
                <ul>
                {accounts.map(account => 
                  <li key={account.id}>
                    {account.account_id} <button type="button" onClick={(e) => this.props.revokeClick(e, userId, account.id)} className="btn btn-secondary"><span className="fa fa-trash-o" aria-hidden="true"></span></button>
                  </li>)}
                </ul>
                :
                <p>No account connected yet</p>
              }
              {services.map( service => <button key={service.name} onClick={(e) => this.props.connectClick(e, token, service.name, service.title)} className="btn btn-primary">Connect to {service.title}</button> )}
            </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userId = getUserId(state);
  const token = getApiToken(state);

  const services = getServices(state);
  const accounts = getAccounts(state, userId);

  return {
    userId,
    token,
    services,
    accounts,
  }
};

const mapDispatchToProps = (dispatch) => ({
  fetchServices : () =>{
     dispatch(fetchServices())
  },
  fetchAccounts : (userId) =>{
     dispatch(fetchAccounts(userId))
  },
  connectClick : (event, token, serviceName, serviceTitle) => {
    event.preventDefault();
    console.log("Connecting to", serviceName);
    connectAccount(token, serviceName, serviceTitle);
  },
  revokeClick : (event, userId, accountId) => {
    event.preventDefault();
    console.log("Revoking access to account", userId, accountId);
    dispatch(revokeAccount(userId, accountId))
  },
})

Settings = connect(mapStateToProps,mapDispatchToProps)(Settings)
export default Settings;