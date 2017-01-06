import React, { Component } from 'react';
import { connect } from 'react-redux'

import { fetchWidget } from '../actions'
import { getWidgetItems } from '../reducers'

class Widget extends Component {
  
  componentDidMount() {
     //this.props.fetchWidgetData(this.props.widgetId);
  }
  
  render() {
    const title = this.props.config.title;
    const link = this.props.config.link;
    const unreadCount = 3;

    return (
      <div className="card">
        <div className="card-header">
          {link ? <a href="{link}" target="_blank">{title}</a> : <span>{title}</span>}
          <div className="pull-right">
            {unreadCount>0 ? <span className="tag tag-default">{unreadCount}</span> : null} {' '}
            <div className="btn-group btn-group-sm" role="group" aria-label="Actions">
              <button type="button" className="btn btn-secondary"><span className="fa fa-refresh" aria-hidden="true"></span></button>
              <button type="button" className="btn btn-secondary"><span className="fa fa-cog" aria-hidden="true"></span></button>
            </div>
          </div>
        </div>
        <div className="card-block">
            Content
        </div>
    </div>
    );
  }
}

/*
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
*/
export default Widget;