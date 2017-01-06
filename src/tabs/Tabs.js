import React, { Component } from 'react';
import { connect } from 'react-redux'

import { fetchTab } from '../actions'
import { getTabWidgets } from '../reducers'

class Tabs extends Component {
  
  componentDidMount() {
      this.props.fetchTabData(this.props.params.tabId);
  }
  
  render() {
    const widgets = this.props.widgets(this.props.params.tabId) || [[],[],[],[]];

    return (
      <div className="container-fluid">
        <p>Tabs {this.props.params.tabId}</p>
        <p>Widget counts: {widgets.length} </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  widgets : (tabId) => {
    console.log('tabId', state, tabId)
    return getTabWidgets(state, tabId)
  }
});

const mapDispatchToProps = (dispatch) => ({
  fetchTabData : (tabId) => { dispatch(fetchTab(tabId)) },
});

Tabs = connect(mapStateToProps,mapDispatchToProps)(Tabs)
export default Tabs;