import React, { Component } from 'react';
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { getTab } from '../reducers'
import { updateTab, deleteTab } from '../actions'

class TabSettings extends Component {
  constructor(props) {
    super(props);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleSaveClick(event) {
    const tabId = this.props.params.tabId;
    this.props.onSaveClick(event, tabId, this.inputTabTitle.value);
  }
  handleDeleteClick(event) {
    const tabId = this.props.params.tabId;
    this.props.onDeleteClick(event, tabId);
  }
  render() {
    const tabId = this.props.params.tabId;
    const tabTitle = this.props.getTabTitle(tabId);

    return (
      <div className="container">
        <div className="card ">
          <div className="card-header">Tab settings</div>
          <div className="card-block">
            <div className="form-group row">
            <label className="col-sm-2">Title</label>
            <div className="col-sm-10">
                <div className="form-check">
                <label className="form-check-label">
                    <input className="form-check-input" type="text" ref={(input) => this.inputTabTitle = input} defaultValue={tabTitle} />
                </label>
                </div>
            </div>
            </div>
            <div className="form-group row">
                <div className="offset-sm-2 col-sm-10">
                    <button type="submit" className="btn btn-primary" onClick={this.handleSaveClick}>Save</button>
                </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Delete</div>
          <div className="card-block">
            <p>Do you want to permanently delete the tab '{tabTitle}'? This operation can't be reverted.</p>
            <div className="form-group row">
                <div className="offset-sm-2 col-sm-10">
                    <button type="submit" className="btn btn-danger" onClick={this.handleDeleteClick}>Delete</button>
                </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

const mapStateToProps = (state) => ({
  getTabTitle : (id) => {
    const tab = getTab(state, id);
    return tab ? tab.title : '';
  }
});

const mapDispatchToProps = (dispatch) => ({
  onSaveClick : (event, tabId, tabTitle) => {
    event.preventDefault();
    dispatch(updateTab(tabId, tabTitle));
    },
  onDeleteClick : (event, tabId) => {
    event.preventDefault();
    dispatch(deleteTab(tabId));
    dispatch(push('/'));
  },
})

const ConnectedTabSettings = connect(mapStateToProps,mapDispatchToProps)(TabSettings)
export default ConnectedTabSettings;