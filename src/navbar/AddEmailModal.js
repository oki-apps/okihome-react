import React, { Component } from 'react';

class AddEmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedService: undefined, selectedAccount: undefined}
    this.handleAddEmailSubmit = this.handleAddEmailSubmit.bind(this);
    this.handleAddEmailClick = this.handleAddEmailClick.bind(this);
    this.handleServiceChange = this.handleServiceChange.bind(this);
  }

  handleAddEmailSubmit(event) {
    const tabId = this.props.tabId ? this.props.tabId : null;
    this.props.onAddEmailClick(event, tabId, this.state.selectedAccount);
    event.preventDefault();
  }

  handleAddEmailClick(event) {
    const tabId = this.props.tabId ? this.props.tabId : null;
    this.props.onAddEmailClick(event, tabId, this.state.selectedAccount);
  }

  handleServiceChange(event) {
    this.setState({selectedService: event.target.value});
    const accountsForSelected = [];
    this.props.accounts.forEach((a) => {
      if(a.provider_name === event.target.value) {
        accountsForSelected.push(a)
      }
    })
    console.log("accountsForSelected",accountsForSelected)
    if(accountsForSelected.length>0) {
      this.setState({selectedAccount: accountsForSelected[0].id})
    }
  }

  handleAccountChange(event) {
    this.setState({selectedAccount: event.target.value});
  }

  componentDidUpdate(prevProps) {
    if(!this.state.selectedService && this.props.services && this.props.services.length>0) {
      this.setState({selectedService: this.props.services[0].name})
    }
    if(!this.state.selectedAccount && this.props.accounts && this.state.selectedService) {
      const accountsForSelected = [];
      this.props.accounts.forEach((a) => {
        if(a.provider_name === this.state.selectedService) {
          accountsForSelected.push(a)
        }
      })
      if(accountsForSelected.length>0) {
        this.setState({selectedAccount: accountsForSelected[0].id})
      }
    }
  }

  render() {

    const services = this.props.services;
    const accounts = this.props.accounts;

    if (!services) {
      return null
    }

    var selectedService = this.state.selectedService;

    var servicesOptions = [];
    services.forEach((s) => {
      servicesOptions.push(<option key={s.name} value={s.name}>{s.title}</option>)
    })

    var accountsOptions = [];
    accounts.forEach((a) => {
      if(a.provider_name === selectedService) {
        accountsOptions.push(<option key={a.id} value={a.id}>{a.account_id}</option>)
      }
    })
    var selectedAccount = this.state.selectedAccount;

    return (
        <div className="modal fade" id="addEmailModal" tabIndex="-1" role="dialog" aria-labelledby="addEmailModalTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addEmailModalTitle"><i className="fa fa-envelope-o fa-fw"></i> Add email</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleAddEmailClick}>
                  <div className="form-group">
                    <label htmlFor="inputProvider">Provider</label>
                    <select className="form-control" name="inputProvider" id="inputProvider" value={selectedService} onChange={this.handleServiceChange}>
                      {servicesOptions}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAccount">Account</label>
                    <select className="form-control" name="inputAccount" id="inputAccount" value={selectedAccount}  onChange={this.handleAccountChange}>
                      {accountsOptions}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="btn-group" role="group" aria-label="Actions">
                  <button type="button" className="btn btn-primary" onClick={this.handleAddEmailClick} data-dismiss="modal">OK</button>
                  <button type="button" className="btn btn-warning" data-dismiss="modal">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default AddEmailModal;
