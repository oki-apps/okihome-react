import React, { Component } from 'react';
import { connect } from 'react-redux'

import Widget from '../widget/Widget';

import { fetchTab } from '../actions'
import { getTabWidgets } from '../reducers'

class Tabs extends Component {
  
  componentDidMount() {
      this.props.fetchTabData(this.props.params.tabId);
  }

  componentDidUpdate(prevProps) {
    let prevId = prevProps.params ? prevProps.params.tabId : null;
    let currentId = this.props.params ? this.props.params.tabId : null;
    
    if(currentId !== prevId && currentId) {
      this.props.fetchTabData(this.props.params.tabId);
    }
  }
  
  render() {
    const widgets = this.props.widgets(this.props.params.tabId) || [[],[],[],[]];

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <div className="row">
              <div className="col-lg-6">{
                widgets[0].map(widget => (
                  <Widget key={widget.id} id={widget.id} config={widget.config} />
                ))
              }</div>
              <div className="col-lg-6">{
                widgets[1].map(widget => (
                  <Widget key={widget.id} id={widget.id} config={widget.config} />
                ))
              }</div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-lg-6">{
                widgets[2].map(widget => (
                  <Widget key={widget.id} id={widget.id} config={widget.config} />
                ))
              }</div>
              <div className="col-lg-6">{
                widgets[3].map(widget => (
                  <Widget key={widget.id} id={widget.id} config={widget.config} />
                ))
              }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  widgets : (tabId) => getTabWidgets(state, tabId),
});

const mapDispatchToProps = (dispatch) => ({
  fetchTabData : (tabId) => { dispatch(fetchTab(tabId)) },
});

Tabs = connect(mapStateToProps,mapDispatchToProps)(Tabs)
export default Tabs;