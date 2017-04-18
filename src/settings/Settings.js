import React, { Component } from 'react';
import { connect } from 'react-redux'

import { fetchServices, fetchAccounts, revokeAccount } from '../actions'
import { getUserId, getApiToken, getServices, getAccounts } from '../reducers'

import { connectAccount, backup, restore } from '../okihomeApi'

class Settings extends Component {

  constructor(props) {
    super(props)
    
    this.fileChanged = this.fileChanged.bind(this);
  }

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

  fileChanged(event) {
    console.log("fileChanged",this.fileUpload.files.length,event)

    this.fileContent = {}

    if(this.fileUpload.files.length === 0 ){
      return;
    }

    const f = this.fileUpload.files[0];

    let reader = new FileReader();
    reader.onloadend = (e) => {
      this.fileContent = JSON.parse(e.target.result)
      console.log("new file decoded", this.fileContent)
    }
    reader.readAsText(f);

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
        <div className="card">
            <div className="card-header">Backup and restore</div>
            <div className="card-block">
              <p>You can download a file containing all of your current settings, in order to import it on the same instance latter or in an other instance.</p>
              <p>
                <button type="button" onClick={(e) => this.props.backupClick(e, token, userId)} className="btn btn-primary"><span className="fa fa-floppy-o" aria-hidden="true"></span> Download backup</button>
              </p>
              <p>If you want to import a previous backup, you have to delete all your existing tabs and reconnect to the same accounts as in the backup file before importing.</p>
              <p>
                <input type="file" ref={(ref) => this.fileUpload = ref} onChange={(e) => this.fileChanged(e)} name="fileInput" />
                <button type="button" onClick={(e) => this.props.restoreClick(e, token, userId, this.fileContent)} className="btn btn-primary"><span className="fa fa-upload" aria-hidden="true"></span></button>
              </p>
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
  backupClick : (event, token, userId) => {
    event.preventDefault();
    console.log("Backup started", userId);
    backup(token, userId).then(function(response){
      console.log("Backup received", response.data);

      var url = URL.createObjectURL(new Blob([JSON.stringify(response.data)], {type: "application/json"}));
      var a = document.createElement("a");
       a.href = url;
        a.download = "backup_"+userId+"_"+ (new Date()).toISOString() +".json";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 

    });
  },
  restoreClick : (event, token, userId, data) => {
    event.preventDefault();
    console.log("Restore started");
    restore(token, userId, data);
  },
})

Settings = connect(mapStateToProps,mapDispatchToProps)(Settings)
export default Settings;